'use strict';

import express from 'express';
import logger from '../app/logger';
import bodyParser from 'body-parser';
import controller from '../controllers/core.server.controller.api';
import { config } from '../config/server';

function init(app) {
  return new Promise(function (resolve, reject) {
    logger.debug('Core::Server::Api::Routes::Start');

    let router = express.Router();

    router.use(bodyParser.urlencoded({
      extended: true
    }));
    router.use(bodyParser.json());


    router.route('/api')
      .all(controller.middleware)
      .get(controller.get);

    app.use(router);

    logger.verbose('Core::Server::Api::Routes::Success');

    return resolve(app);

  });
}


let service = { init: init };

export default service;
export { init };
