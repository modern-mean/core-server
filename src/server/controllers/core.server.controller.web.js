'use strict';

import path from 'path';
import { config } from '../config/server';
import logger from '../app/logger';

function renderIndex(req, res) {
  logger.silly('Core::Server::Render::Index', config.swig.views + '/' + config.swig.layout);
  res.render(config.swig.layout);
}

function renderServerError(req, res) {
  res.status(500).render('500', {
    error: 'Oops! Something went wrong...'
  });
}

function renderNotFound(req, res) {
  res.status(404).format({
    'text/html': function () {
      res.render('404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.json({
        error: 'Path not found'
      });
    }
  });
}

let controller = { renderIndex: renderIndex, renderServerError: renderServerError, renderNotFound: renderNotFound };

export default controller;
export {
  renderIndex,
  renderServerError,
  renderNotFound
};
