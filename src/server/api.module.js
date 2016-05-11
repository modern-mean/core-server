'use strict';

import logger from './app/logger';
import routes from './routes/core.server.routes.api';
import { config } from './config/server';



function init(app) {
  return new Promise(function (resolve, reject) {
    if (config.type === 'web') {
      return resolve(app);
    }
    logger.debug('Core::Server::Api::Start');

    routes.init(app)
      .then(function (app) {
        logger.verbose('Core::Server::Api::Routes::Success');
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
