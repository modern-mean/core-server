'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.middleware = exports.get = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _server = require('../config/server');

var _logger = require('../app/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function get(req, res) {
  res.status(500).json({ error: 'This url is for api calls only.  You should not be here' });
}

function middleware(req, res, next) {
  res.set('Content-Type', 'application/json');
  //Debatable whether this should be set or not.  guessing most will have a mobile app.  should make configurable in the future
  res.set('Access-Control-Allow-Origin', '*');

  return next();
}

let controller = { get: get, middleware: middleware };

exports.default = controller;
exports.get = get;
exports.middleware = middleware;