'use strict';

import logger from './app/logger';
import routes from './routes/core.server.routes.web';
import consolidate from 'consolidate';
import { config } from './config/server';



function init(app) {
  return new Promise(function (resolve, reject) {
    if (config.type === 'api') {
      return resolve();
    }
    logger.debug('Core::Server::Web::Init::Start');

    app.engine('html', consolidate['swig']);
    app.set('view engine', 'html');
    app.set('views', config.swig.views);

    routes.init(app)
      .then(function (app) {
        logger.verbose('Core::Server::Web::Init::Success');
        return resolve(app);
      })
      .catch(function (err) {
        logger.error(err);
        return reject(err);
      });
  });

}

let service = { init: init };

export default service;
export { init };
