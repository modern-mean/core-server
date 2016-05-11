'use strict';

let serverConfig;

function load() {
  serverConfig = {
    app: {
      title: process.env.MM_CORE_TITLE || 'MODERN-MEAN',
      description: process.env.MM_CORE_DESCRIPTION || 'Full-Stacka JavaScript with MongoDB, Express, AngularJS, and Node.js',
      keywords: process.env.MM_CORE_KEYWORDS || 'mongodb, express, angularjs, node.js, mongoose, passport',
      logo: process.env.MM_CORE_LOGO || '/dist/img/core/client/img/brand/logo.png',
      favicon: process.env.MM_CORE_FAVICON || '/dist/img/core/client/img/brand/favicon.ico',
    },
    express: {
      host: process.env.MM_CORE_HOST || '0.0.0.0',
      http: {
        port: process.env.MM_CORE_HTTP_PORT || '8080',
      },
      https: {
        enable: process.env.MM_CORE_HTTPS || 'false', //Enabling SSL makes the entire site forced over SSL.
        port: process.env.MM_CORE_HTTPS_PORT || '8443',
        options: {
          key: process.env.MM_CORE_HTTPS_KEY || __dirname + '/../ssl/key.pem',
          cert: process.env.MM_CORE_HTTPS_CERT || __dirname + '/../ssl/cert.pem'
        }
      },
      livereload: process.env.MM_CORE_LIVERELOAD || 'false'
    },
    logs: {
      //https://github.com/expressjs/morgan
      morgan: {
        format: process.env.MM_CORE_MORGAN_FORMAT || process.env.MM_MORGAN_FORMAT || 'short'
      },
      //https://github.com/winstonjs/winston
      winston: {
        level:  process.env.MM_CORE_WINSTON_LEVEL || process.env.MM_WINSTON_LEVEL || 'info', //{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
        file: process.env.MM_CORE_WINSTON_FILE || process.env.MM_WINSTON_FILE || './logs/core.log',
        console: process.env.MM_CORE_WINSTON_CONSOLE || process.env.MM_WINSTON_CONSOLE || 'true'
      }
    },
    modules: {
      core: process.env.MM_CORE_MODULES_CORE || '../core.module.js',
      custom: process.env.MM_CORE_MODULES_CUSTOM || ['./modules/*/dist/server/!(*core).module.js', './node_modules/modern-mean-*/dist/server/!(*core).module.js']
    },
    swig: {
      layout: process.env.MM_CORE_SERVER_LAYOUT || 'material',
      views: process.env.MM_CORE_SERVER_VIEWS || './dist/server/views'
    },
    type: process.env.MM_CORE_SERVER_TYPE || 'fullstack' //Options are web, api, fullstack
  };
}

load();

export { load, serverConfig as config };