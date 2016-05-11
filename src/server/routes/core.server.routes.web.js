'use strict';

import express from 'express';
import logger from '../app/logger';
import { config } from '../config/server';
import controller from '../controllers/core.server.controller.web';

function init(app) {
  return new Promise(function (resolve, reject) {
    logger.debug('Core::Server::Web::Routes::Start');
    let router = express.Router();

    router.use('./public', express.static(config.swig.views));
    router.get('/*', controller.renderIndex);

    app.use(router);

    logger.verbose('Core::Server::Web::Routes::Success');
    return resolve(app);
  });
}

let service = { init: init };

export default service;
export { init };
