import mongoose from '../../fake-mongoose/mongooseFake';
import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { users } from '../../fake-db-data/users';
import { getUserController } from '../../../server/providers/users/controllers';
import { ROLES } from '../../../server/constants/roles';
import { Request, Response } from '../../../server/interfaces/express';

describe('Users => GetUserController', function () {
  const fakeCollections = {
    users
  };
  let status;
  let send;
  let json;
  let request: Request;
  let response: Response;

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
    response = { status, send, json };
    status.returns(response);
  });

  it('shoult get test users by roles', async () => {
    const shouldResult = ['publisher_change', 'publisher_new_dom', 'account1', 'minecraft'];
    request.query.roles = `${ROLES.ACCOUNT_MANAGER},${ROLES.PUBLISHER}`;

    await getUserController.getTestUsers(request, response);
    
    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);

    expect(statusResult).to.be.an('number');
    expect(statusResult).to.equal(200);
    expect(bodyResult.status).to.be.an('number');
    expect(bodyResult.status).to.equal(200);
    expect(bodyResult.data).to.be.an('array');

    for (let i = 0; i < shouldResult.length; i++) {
      expect(bodyResult.data[i].name).to.equal(shouldResult[i]);
    }
  });
});
