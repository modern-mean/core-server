'use strict';

let serverConfig;

function load() {
  serverConfig = {
    app: {
      title: process.env.MM_CORE_SERVER_TITLE || 'MODERN-MEAN',
      description: process.env.MM_CORE_SERVER_DESCRIPTION || 'Full-Stacka JavaScript with MongoDB, Express, AngularJS, and Node.js',
      keywords: process.env.MM_CORE_SERVER_KEYWORDS || 'mongodb, express, angularjs, node.js, mongoose, passport',
      logo: process.env.MM_CORE_SERVER_LOGO || '/dist/img/core/client/img/brand/logo.png',
      favicon: process.env.MM_CORE_SERVER_FAVICON || '/dist/img/core/client/img/brand/favicon.ico',
    },
    express: {
      host: process.env.MM_CORE_SERVER_HOST || '0.0.0.0',
      http: {
        port: process.env.MM_CORE_SERVER_HTTP_PORT || '8080',
      },
      https: {
        enable: process.env.MM_CORE_SERVER_HTTPS || 'false', //Enabling SSL makes the entire site forced over SSL.
        port: process.env.MM_CORE_SERVER_HTTPS_PORT || '8443',
        options: {
          key: process.env.MM_CORE_SERVER_HTTPS_KEY || __dirname + '/../ssl/key.pem',
          cert: process.env.MM_CORE_SERVER_HTTPS_CERT || __dirname + '/../ssl/cert.pem'
        }
      },
      static: process.env.MM_CORE_SERVER_STATIC || './public',
      livereload: process.env.MM_CORE_SERVER_LIVERELOAD || 'false'
    },
    logs: {
      //https://github.com/expressjs/morgan
      morgan: {
        format: process.env.MM_CORE_SERVER_MORGAN_FORMAT || process.env.MM_MORGAN_FORMAT || 'short'
      },
      //https://github.com/winstonjs/winston
      winston: {
        level:  process.env.MM_CORE_SERVER_LOG_LEVEL || process.env.MM_LOG_LEVEL || 'info', //{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
        file: process.env.MM_CORE_SERVER_LOG_FILE || process.env.MM_LOG_FILE || './logs/core.log',
        console: process.env.MM_CORE_SERVER_LOG_CONSOLE || process.env.MM_LOG_CONSOLE || 'true'
      }
    },
    modules: {
      custom: process.env.MM_CORE_SERVER_MODULE_CUSTOM || ['./node_modules/modern-mean-!(*core-server)/dist/server/*.module.js'],
      web: process.env.MM_CORE_SERVER_MODULE_WEB || 'true',
      api: process.env.MM_CORE_SERVER_MODULE_API || 'true',
    },
    swig: {
      layout: process.env.MM_CORE_SERVER_LAYOUT || 'material',
      views: process.env.MM_CORE_SERVER_VIEWS || './dist/server/views'
    }
  };
}

load();

export { load, serverConfig as config };
