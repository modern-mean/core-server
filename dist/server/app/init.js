'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stop = exports.start = undefined;

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _express = require('./express');

var _express2 = _interopRequireDefault(_express);

var _apiModule = require('../api.module.js');

var _apiModule2 = _interopRequireDefault(_apiModule);

var _webModule = require('../web.module.js');

var _webModule2 = _interopRequireDefault(_webModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function start() {
  return new Promise(function (resolve, reject) {
    _logger2.default.verbose('Init::Start');
    _express2.default.init().then(function (app) {
      return Promise.all([_express2.default.variables(app), _express2.default.middleware(app), _express2.default.headers(app)]).then(() => app).catch(err => reject(err));
    }).then(_apiModule2.default.init).then(_express2.default.modules).then(_webModule2.default.init).then(_express2.default.listen).then(function (app) {
      _logger2.default.verbose('Express::Done::Success');
      resolve(app);
    }).catch(function (err) {
      return reject(err);
      _logger2.default.error(err);
    });
  });
}

function stop() {
  return new Promise(function (resolve, reject) {
    Promise.all([_express2.default.destroy()]).then(function () {
      _logger2.default.verbose('MEAN::Stop::Success');
      resolve();
    }).catch(function (err) {
      _logger2.default.error(err);
      reject(err);
    });
  });
}

let service = { start: start, stop: stop };
exports.default = service;
exports.start = start;
exports.stop = stop;