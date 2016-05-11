'use strict';

import http from 'http';
import https from 'https';
import express from 'express';
import logger from './logger';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import consolidate from 'consolidate';
import path from 'path';
import globby from 'globby';
import { config } from '../config/server';
import enableDestroy from 'server-destroy';
import morgan from 'morgan';
import livereload from 'connect-livereload';
import fs from 'fs';
import forceSSL from 'express-force-ssl';

//Store Express server
let httpServer,
  httpsServer,
  expressApp;

function variables(app) {
  return new Promise(function (resolve, reject) {
    logger.debug('Express::Variables::Start');
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.logo = config.logo;
    app.locals.favicon = config.favicon;
    logger.verbose('Express::Variables::Success');
    return resolve(app);
  });
}

function middleware(app) {
  return new Promise(function (resolve, reject) {
    logger.debug('Express::Middleware::Start');
    app.use(morgan(config.logs.morgan.format, config.logs.morgan.options));

    if (config.express.livereload === 'true') {
      app.use(livereload());
    }



    if (config.express.https.enable === 'true') {
      app.set('forceSSLOptions', {
        httpsPort: config.express.https.port
      });

      app.use(forceSSL);
    }

    logger.verbose('Express::Middleware::Success');
    return resolve(app);
  });
}


function headers(app) {
  return new Promise(function (resolve, reject) {
    logger.debug('Express::Headers::Start');
    app.use(helmet());
    logger.verbose('Express::Headers::Success');
    return resolve(app);
  });
}

function modules(app) {
  return new Promise(function (resolve, reject) {
    logger.debug('Express::Modules::Start', config.modules.custom);
    let promises = [];
    globby(config.modules.custom)
      .then(files => {
        files.forEach(file => {
          logger.debug('Express::Module::Match::' + file);
          try {
            let promise = require(path.resolve(file)).default.init(app);
            promises.push(promise);
          } catch(err) {
            logger.error('Express::Modules::Error', err);
            return reject(err);
          }

        });

        Promise.all(promises)
          .then(() => {
            logger.verbose('Express::Modules::Success', config.modules.custom);
            return resolve(app);
          })
          .catch(err => {
            logger.error('Express::Modules::Error', err);
            return reject(err);
          });
      });

  });
}

function listen(app) {
  logger.debug('Express::Listen::Start');
  let httpServerPromise = new Promise(function (resolve, reject) {

    httpServer.listen(config.express.http.port, config.express.host, () => {
      /* istanbul ignore else: cant test this since production server cant be destroyed  */
      if(process.env.NODE_ENV !== 'production') {
        enableDestroy(httpServer);
      }
      resolve(app);
    });

  });

  let httpsServerPromise = new Promise(function (resolve, reject) {
    if (config.express.https.enable !== 'true') {
      return resolve();
    }

    httpsServer.listen(config.express.https.port, config.express.host, () => {
      /* istanbul ignore else: cant test this since production server cant be destroyed  */
      if(process.env.NODE_ENV !== 'production') {
        enableDestroy(httpsServer);
      }
      resolve(app);
    });

  });

  return Promise.all([httpServerPromise, httpsServerPromise])
          .then(promises => {
            logger.info('--');
            logger.info(config.app.title);
            logger.info('Environment:     ' + process.env.NODE_ENV);
            logger.info('HTTP Server:     http://' + httpServer.address().address + ':' + httpServer.address().port);
            if (config.express.https.enable === 'true') {
              logger.info('HTTPS Server:    https://' + httpsServer.address().address + ':' + httpsServer.address().port);
            }
            logger.info('--');
            return app;
          });
}

function init() {
  return new Promise(function (resolve, reject) {
    logger.debug('Express::Init::Start', config.express.https);
    if (expressApp !== undefined || httpsServer !== undefined || httpServer !== undefined) {
      return reject('Express::Init::Error::Server is still running.');
    }
    expressApp = express();
    httpServer = http.createServer(expressApp);
    if (config.express.https.enable === 'true') {
      console.log(__dirname, process.cwd());
      let httpsOptions = {
        key: fs.readFileSync(config.express.https.options.key),
        cert: fs.readFileSync(config.express.https.options.cert)
      };
      httpsServer = https.createServer(httpsOptions, expressApp);
    }
    logger.verbose('Express::Init::Success');
    return resolve(expressApp);
  });
}

function destroy() {
  expressApp = undefined;
  let httpServerPromise = new Promise(function (resolve, reject) {
    if (!httpServer || !httpServer.listening) {
      httpServer = undefined;
      return resolve();
    }

    httpServer.destroy(function () {
      httpServer = undefined;
      resolve();
    });
  });

  let httpsServerPromise = new Promise(function (resolve, reject) {
    if (!httpsServer || !httpsServer.listening) {
      httpsServer = undefined;
      return resolve();
    }

    httpsServer.destroy(function () {
      httpsServer = undefined;
      return resolve();
    });
  });

  return Promise.all([httpServerPromise, httpsServerPromise])
          .then(() => {
            logger.info('Express::Destroy::Success');
          });
}

function getHttpServer() {
  return httpServer;
}

function getHttpsServer() {
  return httpsServer;
}

function getExpressApp() {
  return expressApp;
}

let service = { express: express, headers: headers, init: init, listen: listen, middleware: middleware, modules: modules, variables: variables, destroy: destroy, httpServer: getHttpServer, httpsServer: getHttpsServer, getExpressApp: getExpressApp };
export default service;
export {
  express,
  headers,
  init,
  listen,
  middleware,
  modules,
  variables,
  getHttpServer as httpServer,
  getHttpsServer as httpsServer,
  getExpressApp,
  destroy
};
