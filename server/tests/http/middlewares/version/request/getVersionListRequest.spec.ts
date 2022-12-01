import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { ROLES } from '../../../../../server/constants/roles';
import { getVersionListRequest } from '../../../../../server/providers/version/middlewares/request';

describe('Version => GetVersionListRequest', function () {
  let status: any;
  let send: any;
  let json: any;
  let request: any;
  let response: any;
  let next: any;

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

  it('should success validate all parameters', () => {
    request.query = {
      version: 'v1.1.1.1',
      userRole: ROLES.PUBLISHER
    };

    getVersionListRequest.use(request, response, next);

    expect(next.calledOnce).to.be.true;
  });

  it('should error userRole parameter', () => {
    request.query = {
      version: 'v1.1.1.1',
      userRole: 'odmen'
    };

    getVersionListRequest.use(request, response, next);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.error;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(422);
    expect(send.calledOnce).to.be.true;
    expect(result.fields.includes('userRole')).to.be.true;
  });
});
