'use strict';

import express from 'express';
import * as routes from '../../../src/server/routes/core.server.routes.api';
import * as controller from '../../../src/server/controllers/core.server.controller.api';
import mean from '../../../src/server/app/init';

let sandbox;

describe('modules/core/server/routes/core.server.routes.api.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  it('should export default', () => {
    return routes.default.should.be.an('object');
  });

  it('should export init', () => {
    return routes.init.should.be.a('function');
  });

  describe('init()', () => {
    let app, mockRouter, promise;

    beforeEach(() => {
      app = express();
      let router = express.Router();
      mockRouter = sandbox.mock(router);
      mockRouter.expects('use').twice().returnsThis();
      mockRouter.expects('route').once().returnsThis();
      mockRouter.expects('all').once().returnsThis();
      mockRouter.expects('get').once().returnsThis();
      sandbox.stub(express, 'Router').returns(mockRouter.object);
      promise = routes.init(app);
      return promise;
    });

    describe('success', () => {

      it('should resolve a promise', () => {
        return promise.should.be.resolved;
      });

      it('should set static routes', () => {
        return mockRouter.verify();
      });


    });

    xdescribe('error', () => {

      let mockExpress;

      beforeEach(() => {
        mockExpress = sandbox.stub(app, 'use').throws('yay');
      });

      it('should reject a promise', () => {
        return routes.init(app).should.be.rejectedWith('yay');
      });

    });

  });

});
