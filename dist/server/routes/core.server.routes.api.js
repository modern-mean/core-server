'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _logger = require('../app/logger');

var _logger2 = _interopRequireDefault(_logger);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _coreServerController = require('../controllers/core.server.controller.api');

var _coreServerController2 = _interopRequireDefault(_coreServerController);

var _server = require('../config/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(app) {
  return new Promise(function (resolve, reject) {
    _logger2.default.debug('Core::Server::Api::Routes::Start');

    let router = _express2.default.Router();

    router.use(_bodyParser2.default.urlencoded({
      extended: true
    }));
    router.use(_bodyParser2.default.json());

    router.route('/api').all(_coreServerController2.default.middleware).get(_coreServerController2.default.get);

    app.use(router);

    _logger2.default.verbose('Core::Server::Api::Routes::Success');

    return resolve(app);
  });
}

let service = { init: init };

exports.default = service;
exports.init = init;