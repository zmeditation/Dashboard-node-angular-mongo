import mongoose from '../../../fake-mongoose/mongooseFake';
import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { versionsData } from '../../../fake-db-data/versions';
import { deleteVersionCheckVersionExistMiddleware } from '../../../../server/providers/version/middlewares';

describe('Version => DeleteVersionCheckVersionExistMiddleware', function () {
  const fakeCollections = {
    versions: versionsData
  };

  let status: any;
  let send: any;
  let json: any;
  let request: any;
  let response: any;
  let next: any;

  mongoose.prepareMongoUnit();

  before('Start fake mongodb server', async () => {
    await mongoose.connect();
    await mongoose.setCollections({ fakeCollections });
  });

  after(async () => {
    await mongoose.disconnect();
  });

  beforeEach(() => {
    request = {
      query: {},
      body: {},
      method: '',
      params: {}
    };
    status = stub();
    send = spy();
    json = spy();
    next = spy();
    response = { status, send, json };
    status.returns(response);
  });

  it('should exist version', async () => {
    const version = 'v1.1.1.1';

    request.query = {
      value: version
    };

    await deleteVersionCheckVersionExistMiddleware.use(request, response, next);

    expect(next.calledOnce).to.be.true;
  });

  it('should not exist version', async () => {
    const version = 'v2.1.1.1';

    request.query = {
      value: version
    };

    await deleteVersionCheckVersionExistMiddleware.use(request, response, next);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.error;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(404);
    expect(send.calledOnce).to.be.true;
    expect(result.message).to.equal(`Version ${ version } is not exist`);
    expect(result.fields.includes('version')).to.be.true;
  });
});
