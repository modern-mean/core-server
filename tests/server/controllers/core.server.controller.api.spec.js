'use strict';

import * as controller from '../../../src/server/controllers/core.server.controller.api';

let sandbox;

describe('/modules/core/server/controllers/core.server.controller.api.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  it('should export default', () => {
    controller.default.should.be.an('object');
  });

  it('should export renderIndex', () => {
    controller.get.should.be.a('function');
  });

  describe('get()', () => {
    let mockRes;

    beforeEach(() => {
      mockRes = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub().resolves()
      };
    });

    it('should call res.status', () => {
      controller.get({}, mockRes);
      return mockRes.status.should.have.been.calledWith(500);
    });

    it('should call res.json', () => {
      controller.get({}, mockRes);
      return mockRes.json.should.have.been.calledWith({ error: 'This url is for api calls only.  You should not be here' });
    });

  });

});
