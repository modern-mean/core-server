'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

var _logger = require('./app/logger');

var _logger2 = _interopRequireDefault(_logger);

var _coreServerRoutes = require('./routes/core.server.routes.api');

var _coreServerRoutes2 = _interopRequireDefault(_coreServerRoutes);

var _server = require('./config/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(app) {
  return new Promise(function (resolve, reject) {
    if (_server.config.type === 'web') {
      return resolve(app);
    }
    _logger2.default.debug('Core::Server::Api::Start');

    _coreServerRoutes2.default.init(app).then(function (app) {
      _logger2.default.verbose('Core::Server::Api::Routes::Success');
      return resolve(app);
    }).catch(function (err) {
      _logger2.default.error(err);
      return reject(err);
    });
  });
}

let service = { init: init };

exports.default = service;
exports.init = init;