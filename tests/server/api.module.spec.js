'use strict';

import * as api from '../../src/server/api.module';
import routes from '../../src/server/routes/core.server.routes.api';
import express from 'express';

let sandbox;

describe('/modules/core/server/api.module.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  describe('export', () => {

    it('should export default', () => {
      return api.default.should.be.an('object');
    });

    it('should export init', () => {
      return api.init.should.be.a('function');
    });

    describe('init()', () => {
      let mockRoutes, app;

      describe('success', () => {

        beforeEach(() => {
          app = express();
          mockRoutes = sandbox.stub(routes, 'init').resolves();
        });

        it('should call init routes', () => {
          return api.init(app)
                  .then(() => {
                    return mockRoutes.should.be.calledWith(app);
                  });
        });

        it('should resolve a promise', () => {
          return api.init(app).should.be.fulfilled;
        });

      });

      describe('error', () => {

        beforeEach(() => {
          app = express();
          mockRoutes = sandbox.stub(routes, 'init').rejects();
        });

        it('should reject a promise', () => {
          return api.init(app).should.be.rejected;
        });

      });

    });

  });

});
