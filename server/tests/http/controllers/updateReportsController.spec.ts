import mongoose from '../../fake-mongoose/mongooseFake';
import UpdateReportsController from '../../../server/http/controllers/reports/updateReportsController';
import PubAMUpdateService from '../../../server/services/reporting/update/pubAMUpdate/pubAMUpdateService';
import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { reports } from '../../fake-db-data/reports';
import { users } from '../../fake-db-data/users';
import { Request, Response } from '../../../server/interfaces/express';

class PubAMUpdateServiceTest extends PubAMUpdateService {
  public setLimit(value: number): void {
    this.limit = value;
  }
}

describe.skip('Controllers => UpdateReportsController', async () => {
  const fakeCollections = {
    reports,
    users
  };
  const service = new PubAMUpdateServiceTest();
  const controller = new UpdateReportsController(service);
  let status;
  let send;
  let json;
  let request: Request;
  let response: Response;
  let io;
  let serverSocket;
  let clientSocket;

  mongoose.prepareMongoUnit();

  before((done: Function) => {

  });

  before(async () => {
    await mongoose.connect();
    await mongoose.setCollections({ fakeCollections });
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
    response = { status, send, json };
    status.returns(response);
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it('should update reports with iterator', async () => {
    const actualBodyResult = {
      status: 200,
      data: {
        message: 'REPORTS_UPDATING'
      }
    };

    service.setLimit(3);

    request.params.publisherId = '5fd9e3ddaf4ae2d75536f7d7';

    await controller.updatePubAM(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = send.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(send.calledOnce).to.be.true;
    expect(send.args[0][0]).to.equal(JSON.stringify(actualBodyResult));
  });

  it('should update reports without iterator', async () => {
    const actualBodyResult = {
      status: 200,
      data: {
        message: 'REPORTS_UPDATING'
      }
    };

    service.setLimit(30);

    request.params.publisherId = '5fd9e3ddaf4ae2d75536f7d7';

    await controller.updatePubAM(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = send.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(send.calledOnce).to.be.true;
    expect(send.args[0][0]).to.equal(JSON.stringify(actualBodyResult));
  });
});
