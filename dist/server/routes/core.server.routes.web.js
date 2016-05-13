'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _logger = require('../app/logger');

var _logger2 = _interopRequireDefault(_logger);

var _server = require('../config/server');

var _coreServerController = require('../controllers/core.server.controller.web');

var _coreServerController2 = _interopRequireDefault(_coreServerController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(app) {
  return new Promise(function (resolve, reject) {
    _logger2.default.debug('Core::Server::Web::Routes::Start');
    let router = _express2.default.Router();

    router.use('/', _express2.default.static(_server.config.express.static));
    router.get('/*', _coreServerController2.default.renderIndex);

    app.use(router);

    _logger2.default.verbose('Core::Server::Web::Routes::Success');
    return resolve(app);
  });
}

let service = { init: init };

exports.default = service;
exports.init = init;