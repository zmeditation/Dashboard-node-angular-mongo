import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { createVersionRequest } from '../../../../../server/providers/version/middlewares/request';

describe('Version => CreateVersionRequest', function () {
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
    request.body.params = {
      version: 'v1.1.1.1',
      releaseDate: new Date().toString(),
      description: {
        in: 'IN Show must go on',
        out: 'OUT Show must go on'
      }
    };

    createVersionRequest.use(request, response, next);

    expect(next.calledOnce).to.be.true;
  });

  it('should success validate all paremeters with null out description', () => {
    request.body.params = {
      version: 'v1.1.1.1',
      releaseDate: new Date().toString(),
      description: {
        in: 'IN Show must go on',
        out: null
      }
    };

    createVersionRequest.use(request, response, next);

    expect(next.calledOnce).to.be.true;
  });

  it('should error validate version parameter', () => {
    request.body.params = {
      version: 'v1.1.1.1$',
      releaseDate: new Date().toString(),
      description: {
        in: 'IN Show must go on',
        out: null
      }
    };

    createVersionRequest.use(request, response, next);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.error;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(422);
    expect(send.calledOnce).to.be.true;
    expect(result.fields.includes('version')).to.be.true;
  });

  it('should error validate releaseDate parameter', () => {
    request.body.params = {
      version: 'v1.1.1.',
      releaseDate: '',
      description: {
        in: 'IN Show must go on',
        out: null
      }
    };

    createVersionRequest.use(request, response, next);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.error;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(422);
    expect(send.calledOnce).to.be.true;
    expect(result.fields.includes('releaseDate')).to.be.true;
  });

  it('should error validate description parameter', () => {
    request.body.params = {
      version: 'v1.1.1.1',
      releaseDate: ''
    };

    createVersionRequest.use(request, response, next);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.error;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(422);
    expect(send.calledOnce).to.be.true;
    expect(result.fields.includes('description')).to.be.true;
  });

  it('shoult error validate description.in type number parameter', () => {
    request.body.params = {
      version: 'v1.1.1.1',
      releaseDate: '',
      description: {
        in: 1234,
        out: null
      }
    };

    createVersionRequest.use(request, response, next);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.error;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(422);
    expect(send.calledOnce).to.be.true;
    expect(result.fields.includes('description')).to.be.true;
  });

  it('shoult error validate description.in empty string parameter', () => {
    request.body.params = {
      version: 'v1.1.1.1',
      releaseDate: new Date().toString(),
      description: {
        in: '',
        out: null
      }
    };

    createVersionRequest.use(request, response, next);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.error;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(422);
    expect(send.calledOnce).to.be.true;
    expect(result.fields.includes('description')).to.be.true;
  });

  it('should error validate description.out empty string parameter', () => {
    request.body.params = {
      version: 'v1.1.1.1',
      releaseDate: new Date().toString(),
      description: {
        in: 'Show must go on',
        out: ''
      }
    };

    createVersionRequest.use(request, response, next);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.error;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(422);
    expect(send.calledOnce).to.be.true;
    expect(result.fields.includes('description')).to.be.true;
  });
});
