'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.destroy = exports.getExpressApp = exports.httpsServer = exports.httpServer = exports.variables = exports.modules = exports.middleware = exports.listen = exports.init = exports.headers = exports.express = undefined;

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _consolidate = require('consolidate');

var _consolidate2 = _interopRequireDefault(_consolidate);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _globby = require('globby');

var _globby2 = _interopRequireDefault(_globby);

var _server = require('../config/server');

var _serverDestroy = require('server-destroy');

var _serverDestroy2 = _interopRequireDefault(_serverDestroy);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _connectLivereload = require('connect-livereload');

var _connectLivereload2 = _interopRequireDefault(_connectLivereload);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _expressForceSsl = require('express-force-ssl');

var _expressForceSsl2 = _interopRequireDefault(_expressForceSsl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Store Express server
let httpServer, httpsServer, expressApp;

function variables(app) {
  return new Promise(function (resolve, reject) {
    _logger2.default.debug('Express::Variables::Start');
    app.locals.title = _server.config.app.title;
    app.locals.description = _server.config.app.description;
    app.locals.logo = _server.config.logo;
    app.locals.favicon = _server.config.favicon;
    _logger2.default.verbose('Express::Variables::Success');
    return resolve(app);
  });
}

function middleware(app) {
  return new Promise(function (resolve, reject) {
    _logger2.default.debug('Express::Middleware::Start');
    app.use((0, _morgan2.default)(_server.config.logs.morgan.format, _server.config.logs.morgan.options));

    if (_server.config.express.livereload === 'true') {
      app.use((0, _connectLivereload2.default)());
    }

    if (_server.config.express.https.enable === 'true') {
      app.set('forceSSLOptions', {
        httpsPort: _server.config.express.https.port
      });

      app.use(_expressForceSsl2.default);
    }

    _logger2.default.verbose('Express::Middleware::Success');
    return resolve(app);
  });
}

function headers(app) {
  return new Promise(function (resolve, reject) {
    _logger2.default.debug('Express::Headers::Start');
    app.use((0, _helmet2.default)());
    _logger2.default.verbose('Express::Headers::Success');
    return resolve(app);
  });
}

function modules(app) {
  return new Promise(function (resolve, reject) {
    _logger2.default.debug('Express::Modules::Start', _server.config.modules.custom);
    let promises = [];
    (0, _globby2.default)(_server.config.modules.custom).then(files => {
      files.forEach(file => {
        _logger2.default.debug('Express::Module::Match::' + file);
        try {
          let promise = require(_path2.default.resolve(file)).default.init(app);
          promises.push(promise);
        } catch (err) {
          _logger2.default.error('Express::Modules::Error', err);
          return reject(err);
        }
      });

      Promise.all(promises).then(() => {
        _logger2.default.verbose('Express::Modules::Success', _server.config.modules.custom);
        return resolve(app);
      }).catch(err => {
        _logger2.default.error('Express::Modules::Error', err);
        return reject(err);
      });
    });
  });
}

function listen(app) {
  _logger2.default.debug('Express::Listen::Start');
  let httpServerPromise = new Promise(function (resolve, reject) {

    httpServer.listen(_server.config.express.http.port, _server.config.express.host, () => {
      /* istanbul ignore else: cant test this since production server cant be destroyed  */
      if (process.env.NODE_ENV !== 'production') {
        (0, _serverDestroy2.default)(httpServer);
      }
      resolve(app);
    });
  });

  let httpsServerPromise = new Promise(function (resolve, reject) {
    if (_server.config.express.https.enable !== 'true') {
      return resolve();
    }

    httpsServer.listen(_server.config.express.https.port, _server.config.express.host, () => {
      /* istanbul ignore else: cant test this since production server cant be destroyed  */
      if (process.env.NODE_ENV !== 'production') {
        (0, _serverDestroy2.default)(httpsServer);
      }
      resolve(app);
    });
  });

  return Promise.all([httpServerPromise, httpsServerPromise]).then(promises => {
    _logger2.default.info('--');
    _logger2.default.info(_server.config.app.title);
    _logger2.default.info('Environment:     ' + process.env.NODE_ENV);
    _logger2.default.info('HTTP Server:     http://' + httpServer.address().address + ':' + httpServer.address().port);
    if (_server.config.express.https.enable === 'true') {
      _logger2.default.info('HTTPS Server:    https://' + httpsServer.address().address + ':' + httpsServer.address().port);
    }
    _logger2.default.info('--');
    return app;
  });
}

function init() {
  return new Promise(function (resolve, reject) {
    _logger2.default.debug('Express::Init::Start', _server.config.express.https);
    if (expressApp !== undefined || httpsServer !== undefined || httpServer !== undefined) {
      return reject('Express::Init::Error::Server is still running.');
    }
    expressApp = (0, _express2.default)();
    httpServer = _http2.default.createServer(expressApp);
    if (_server.config.express.https.enable === 'true') {
      console.log(__dirname, process.cwd());
      let httpsOptions = {
        key: _fs2.default.readFileSync(_server.config.express.https.options.key),
        cert: _fs2.default.readFileSync(_server.config.express.https.options.cert)
      };
      httpsServer = _https2.default.createServer(httpsOptions, expressApp);
    }
    _logger2.default.verbose('Express::Init::Success');
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

  return Promise.all([httpServerPromise, httpsServerPromise]).then(() => {
    _logger2.default.info('Express::Destroy::Success');
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

let service = { express: _express2.default, headers: headers, init: init, listen: listen, middleware: middleware, modules: modules, variables: variables, destroy: destroy, httpServer: getHttpServer, httpsServer: getHttpsServer, getExpressApp: getExpressApp };
exports.default = service;
exports.express = _express2.default;
exports.headers = headers;
exports.init = init;
exports.listen = listen;
exports.middleware = middleware;
exports.modules = modules;
exports.variables = variables;
exports.httpServer = getHttpServer;
exports.httpsServer = getHttpsServer;
exports.getExpressApp = getExpressApp;
exports.destroy = destroy;