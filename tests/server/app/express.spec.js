'use strict';

import expressModule from '../../../src/server/app/express';
import express from 'express';
import http from 'http';
import https from 'https';

let sandbox;

describe('/modules/core/server/app/express.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  it('should export module', () => {
    return expressModule.should.be.an('object');
  });

  it('should export express', () => {
    return expressModule.express.should.be.a('function');
  });

  it('should have property init', () => {
    return expressModule.init.should.be.a('function');
  });

  describe('init()', () => {

    describe('error', () => {

      before(() => {
        return expressModule.init();
      });

      after(() => {
        return expressModule.destroy();
      });

      it('should reject a promise if the server is already running', () => {
        return expressModule.init().should.be.rejected;
      });

    });

    describe('success', () => {

      describe('http', () => {
        let promise;

        before(() => {
          promise = expressModule.init();
          return promise;
        });

        after(() => {
          return expressModule.destroy();
        });

        it('should resolve a promise on success', () => {
          return promise.should.be.fulfilled;
        });

        it('should resolve an instance of express', () => {
          return promise
                  .then(app => {
                    return app.use.should.be.a('function');
                  });
        });

        it('should create httpServer', () => {
          return expressModule.httpServer().should.be.an('object');
        });

        it('should create expressApp', () => {
          return expressModule.getExpressApp().should.be.a('function');
        });

      });

      describe('https', () => {
        let promise;

        before(() => {
          process.env.MM_CORE_SERVER_HTTPS = 'true';
          config.load();
          promise = expressModule.init();
          return promise;
        });

        after(() => {
          delete process.env.MM_CORE_SERVER_HTTPS;
          config.load();
          return expressModule.destroy();
        });

        it('should resolve a promise on success', () => {
          return promise.should.be.fulfilled;
        });

        it('should resolve an instance of express', () => {
          return promise
                  .then(app => {
                    return app.use.should.be.a('function');
                  });
        });

        it('should create httpServer', () => {
          return expressModule.httpServer().should.be.an('object');
        });

        it('should create httpsServer', () => {
          return expressModule.httpsServer().should.be.an('object');
        });

        it('should create expressApp', () => {
          return expressModule.getExpressApp().should.be.a('function');
        });

      });

    });

  });

  it('should have property variables', () => {
    return expressModule.variables.should.be.a('function');
  });

  describe('variables()', () => {
    let promise;

    before(() => {
      promise = expressModule.init()
        .then(expressModule.variables);
      return promise;
    });

    after(() => {
      return expressModule.destroy();
    });

    it('should resolve a promise on success', () => {
      return promise.should.be.fulfilled;
    });

    it('should set express local variables', () => {
      promise
        .then(app => {
          return Object.keys(app.locals).length.should.be.above(1);
        });
    });

  });

  it('should have property middleware', () => {
    return expressModule.middleware.should.be.a('function');
  });

  describe('middleware()', () => {

    it('should call express.use', () => {
      let app = express();
      let spy = sandbox.spy(app, 'use');
      expressModule.middleware(app);
      return spy.should.have.been.called;
    });

    describe('development environment', () => {

      before(() => {
        process.env.NODE_ENV = 'development';
      });

      after(() => {
        process.env.NODE_ENV = 'test';
      });

      it('should resolve a promise on success', () => {
        let app = express();
        return expressModule.middleware(app).should.be.fulfilled;
      });

    });

    describe('production environment', () => {

      before(() => {
        process.env.NODE_ENV = 'production';
      });

      after(() => {
        process.env.NODE_ENV = 'test';
      });

      it('should resolve a promise on success', () => {
        let app = express();
        return expressModule.middleware(app).should.be.fulfilled;
      });

    });

    describe('https', () => {

      before(() => {
        process.env.MM_CORE_SERVER_HTTPS = 'true';
        config.load();
      });

      after(() => {
        delete process.env.MM_CORE_SERVER_HTTPS;
        config.load();
      });

      it('should resolve a promise on success', () => {
        let app = express();
        return expressModule.middleware(app).should.be.fulfilled;
      });

    });

  });


  it('should have property headers', () => {
    return expressModule.headers.should.be.a('function');
  });

  describe('headers()', () => {

    it('should resolve a promise on success', () => {
      let app = express();
      return expressModule.headers(app).should.be.fulfilled;
    });

    it('should call app.use', () => {
      let app = express();
      let spy = sandbox.spy(app, 'use');
      expressModule.headers(app);
      return spy.should.have.been.called;
    });

  });

  it('should have property modules', () => {
    return expressModule.modules.should.be.a('function');
  });

  describe('modules()', () => {

    describe('success', () => {

      beforeEach(() => {
        process.env.MM_CORE_SERVER_MODULE_CUSTOM = 'tests/server/resolveModule.js';
        config.load();
      });

      afterEach(() => {
        delete process.env.MM_CORE_SERVER_MODULE_CUSTOM;
        config.load();
      });

      it('should resolve a promise on success', () => {
        let app = express();
        return expressModule.modules(app).should.be.fulfilled;
      });

    });

    describe('error', () => {

      beforeEach(() => {
        process.env.MM_CORE_SERVER_MODULE_CUSTOM = 'tests/server/rejectModule.js';
        config.load();
      });

      afterEach(() => {
        delete process.env.MM_CORE_SERVER_MODULE_CUSTOM;
        config.load();
      });

      it('should reject a promise', () => {
        let app = express();
        return expressModule.modules(app).should.be.rejected;
      });

    });

  });

  it('should have property listen', () => {
    return expressModule.listen.should.be.a('function');
  });

  describe('listen()', () => {
    let app, promise;

    describe('success', () => {

      describe('http', () => {

        before(() => {
          promise = expressModule.init()
            .then(expressModule.listen);
          return promise;
        });

        after(() => {
          return expressModule.destroy();
        });

        it('should resolve a promise on success', () => {
          return promise.should.be.fulfilled;
        });

        it('should make httpServer listen', () => {
          return expressModule.httpServer().listening.should.be.equal(true);
        });

      });

      describe('https', () => {

        before(() => {
          process.env.MM_CORE_SERVER_HTTPS = 'true';
          config.load();
          promise = expressModule.init()
            .then(expressModule.listen);
          return promise;
        });

        after(() => {
          delete process.env.MM_CORE_SERVER_HTTPS;
          config.load();
          return expressModule.destroy();
        });

        it('should resolve a promise on success', () => {
          return promise.should.be.fulfilled;
        });

        it('should make httpServer listen', () => {
          return expressModule.httpServer().listening.should.be.equal(true);
        });

        it('should make httpsServer listen', () => {
          return expressModule.httpsServer().listening.should.be.equal(true);
        });

      });

    });

    describe('error', () => {
      let mockHttpCreateServer, mockHttpsCreateServer;

      beforeEach(() => {
        app = express();
        mockHttpCreateServer = sandbox.stub(http, 'createServer').throws();
        mockHttpsCreateServer = sandbox.stub(https, 'createServer').throws();
      });

      it('should reject a promise', () => {
        return expressModule.listen(app).should.be.rejected;
      });

    });

  });

  it('should have property destroy', () => {
    return expressModule.destroy.should.be.a('function');
  });

  describe('destroy()', () => {

    describe('success', () => {

      describe('http', () => {
        let promise;

        beforeEach(() => {
          promise = expressModule.init()
            .then(expressModule.listen)
            .then(expressModule.destroy);

          return promise;
        });

        it('should resolve a promise if nothing is listening', () => {
          return promise
                  .then(() => {
                    return expressModule.destroy().should.be.resolved;
                  });
        });

        it('should resolve a promise', () => {
          return promise.should.be.resolved;
        });

        it('should destroy httpServer', () => {
          return expect(expressModule.httpServer()).to.not.exist;
        });

        it('should destroy expressApp', () => {
          return expect(expressModule.getExpressApp()).to.not.exist;
        });

      });

      describe('https', () => {

        before(() => {
          process.env.MM_CORE_SERVER_HTTPS = 'true';
          config.load();
        });

        after(() => {
          delete process.env.MM_CORE_SERVER_HTTPS;
          config.load();
        });

        beforeEach(() => {
          return expressModule.init()
            .then(expressModule.listen)
            .then(expressModule.destroy);
        });

        it('should resolve a promise if nothing is listening', () => {
          return expressModule.destroy().should.be.resolved;
        });

        it('should resolve a promise', () => {
          return expressModule.destroy().should.be.resolved;
        });

        it('should destroy httpServer', () => {
          return expect(expressModule.httpServer()).to.not.exist;
        });

        it('should destroy httpsServer', () => {
          return expect(expressModule.httpsServer()).to.not.exist;
        });

        it('should destroy expressApp', () => {
          return expect(expressModule.getExpressApp()).to.not.exist;
        });

      });

    });

    it('should have property httpServer', () => {
      return expressModule.httpServer.should.be.a('function');
    });

    it('should have property httpsServer', () => {
      return expressModule.httpsServer.should.be.a('function');
    });

    it('should have property expressApp', () => {
      return expressModule.getExpressApp.should.be.a('function');
    });

  });

});
