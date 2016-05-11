'use strict';

import path from 'path';
import { config } from '../config/server';
import logger from '../app/logger';

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

export default controller;
export {
  get,
  middleware
};
