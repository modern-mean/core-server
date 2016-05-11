'use strict';

import * as web from '../../src/server/web.module';
import routes from '../../src/server/routes/core.server.routes.web';
import express from 'express';

let sandbox;

describe('/modules/core/server/web.module.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  describe('export', () => {

    it('should export default', () => {
      return web.default.should.be.an('object');
    });

    it('should export init', () => {
      return web.init.should.be.a('function');
    });

    describe('init()', () => {
      let mockRoutes, app;

      describe('success', () => {

        beforeEach(() => {
          app = express();
          mockRoutes = sandbox.stub(routes, 'init').resolves();
        });

        it('should call core routes', () => {
          return web.init(app)
                  .then(() => {
                    return mockRoutes.should.be.calledWith(app);
                  });
        });

        it('should resolve a promise', () => {
          return web.init(app).should.be.fulfilled;
        });

      });

      describe('error', () => {

        beforeEach(() => {
          app = express();
          mockRoutes = sandbox.stub(routes, 'init').rejects();
        });

        it('should reject a promise', () => {
          return web.init(app).should.be.rejected;
        });

      });

    });

  });

});
