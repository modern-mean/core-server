'use strict';

import app from '../../../src/server/app/init';
import expressModule from '../../../src/server/app/express';
import apiModule from '../../../src/server/api.module.js';
import webModule from '../../../src/server/web.module.js';

let sandbox;

describe('/modules/core/server/app/init.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  it('should export app', () => {
    return app.should.be.an('object');
  });

  it('should have start property that is a function', () => {
    return app.start.should.be.a('function');
  });

  describe('app.start()', () => {

    describe('error', () => {

      let mockExpress;

      beforeEach(() => {
        mockExpress = sandbox.stub(expressModule, 'init').rejects();
      });

      afterEach(() => {
        return app.stop();
      });

      it('should reject the promise', () => {
        return app.start().should.be.rejected;
      });
    });

    describe('success', () => {

      let mockExpress, apiStub, webStub, promise;

      beforeEach(() => {
        //Express Stubs
        mockExpress = sandbox.mock(expressModule);
        mockExpress.expects('init').once().resolves();
        mockExpress.expects('middleware').once().resolves();
        mockExpress.expects('variables').once().resolves();
        mockExpress.expects('headers').once().resolves();
        mockExpress.expects('modules').once().resolves();
        mockExpress.expects('listen').once().resolves();
        webStub = sandbox.stub(webModule, 'init').resolves();
        apiStub = sandbox.stub(apiModule, 'init').resolves();
        promise = app.start();

        return promise;
      });

      afterEach(() => {
        return app.stop();
      });

      it('should initialize express', () => {
        mockExpress.verify();
        webStub.should.have.been.called;
        return apiStub.should.have.been.called;
      });

      it('should resolve the promise', () => {
        return promise.should.be.fulfilled;
      });
    });

    describe('agent', () => {

      describe('http', () => {

        before(() => {
          return app.start();
        });

        after(() => {
          return app.stop();
        });

        it('should start the http server and be listening', done => {

          request(expressModule.getExpressApp())
            .get('/')
            .expect(200, done);
        });

      });

      describe('https', () => {

        before(() => {
          process.env.MM_CORE_HTTPS = 'true';
          config.load();
          return app.start();
        });

        after(() => {
          delete process.env.MM_CORE_HTTPS;
          config.load();
          return app.stop();
        });

        it('should start the http server and force redirect', done => {
          request(expressModule.getExpressApp())
            .get('/')
            .expect(301, done);
        });

      });



    });

  });

  it('should have stop property that is a function', () => {
    expect(app.stop).to.be.a('function');
  });

  describe('app.stop()', () => {

    describe('express failure', () => {
      let mockExpress;

      beforeEach(() => {
        mockExpress = sandbox.stub(expressModule, 'destroy').rejects();
      });

      it('should reject the promise', done => {
        app.stop()
          .catch(() => {
            done();
          });
      });
    });

  });
});
