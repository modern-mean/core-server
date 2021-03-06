'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

var _logger = require('./app/logger');

var _logger2 = _interopRequireDefault(_logger);

var _coreServerRoutes = require('./routes/core.server.routes.web');

var _coreServerRoutes2 = _interopRequireDefault(_coreServerRoutes);

var _consolidate = require('consolidate');

var _consolidate2 = _interopRequireDefault(_consolidate);

var _server = require('./config/server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(app) {
  return new Promise(function (resolve, reject) {
    if (_server.config.modules.api !== 'true') {
      return resolve();
    }
    _logger2.default.debug('Core::Server::Web::Init::Start');

    app.engine('html', _consolidate2.default['swig']);
    app.set('view engine', 'html');
    app.set('views', _server.config.swig.views);

    _coreServerRoutes2.default.init(app).then(function (app) {
      _logger2.default.verbose('Core::Server::Web::Init::Success');
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