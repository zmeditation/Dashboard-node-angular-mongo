import mongoose from '../../../fake-mongoose/mongooseFake';
import GetUser from '../../../../server/services/users/getUser/GetUser';
import ServiceRunner from '../../../../server/services/ServiceRunner';
import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { users } from '../../../fake-db-data/users';
import { Response } from '../../../../server/interfaces/express';

describe('Service => GetUsers', () => {
  const fakeCollections = {
    users
  };
  let status;
  let send;
  let json;
  let request: any;
  let response: Response;
  const controllerFunc = ServiceRunner(GetUser, (req: any) => {
    return { body: req.body, paramsId: req.params.id, query: req.query };
  });

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

  it('should get user', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllUsers',
        id: '5fd9dc21af4ae2d75536f7d6'
      }
    };

    request.params.id = '5fe20f7f908754585419117a';

    await controllerFunc(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = json.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(json.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(bodyResult.user._id.toString()).to.equal(request.params.id);
    expect(bodyResult.user.name).to.equal('serious SAM');
    expect(bodyResult.user.email).to.equal('sam@sam.sam');
  });

  it('should get user with fields', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllUsers',
        id: '5fd9dc21af4ae2d75536f7d6'
      }
    };

    request.params.id = '5fe20f7f908754585419117a';
    request.query.fields = '_id,name';

    await controllerFunc(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = json.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(json.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(bodyResult.user._id.toString()).to.equal(request.params.id);
    expect(bodyResult.user.name).to.equal('serious SAM');
    expect(bodyResult.user.additional).to.equal(undefined);
    expect(bodyResult.user.commission).to.equal(undefined);
    expect(bodyResult.user.enabled).to.equal(undefined);
    expect(bodyResult.user.connected_users).to.equal(undefined);
    expect(bodyResult.user.permissions).to.equal(undefined);
    expect(bodyResult.user.domains).to.equal(undefined);
    expect(bodyResult.user.cwe).to.equal(undefined);
    expect(bodyResult.user.am).to.equal(undefined);
    expect(bodyResult.user.sam).to.equal(undefined);
    expect(bodyResult.user.date_to_connect_am).to.equal(undefined);
    expect(bodyResult.user.previouslyUploadedReports).to.equal(undefined);
    expect(bodyResult.user.wbidType).to.equal(undefined);
    expect(bodyResult.user.wbidUserId).to.equal(undefined);
    expect(bodyResult.user.oRTBType).to.equal(undefined);
    expect(bodyResult.user.oRTBId).to.equal(undefined);
    expect(bodyResult.user.role).to.equal(undefined);
    expect(bodyResult.user.email).to.equal(undefined);
    expect(bodyResult.user.properties).to.equal(undefined);
    expect(bodyResult.user.photo).to.equal(undefined);
  });

  it('should get user canReadAllPubs', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllPubs',
        id: '5fe20f7f908754585419117a'
      }
    };

    request.params.id = '5fdb3d3f36efda18b4b1701a';

    await controllerFunc(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = json.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(json.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(bodyResult.user._id.toString()).to.equal(request.params.id);
    expect(bodyResult.user.name).to.equal('publisher_change');
    expect(bodyResult.user.email).to.equal('pub@pub.pub');
  });

  it('should get user with fields canReadAllPubs', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllPubs',
        id: '5fe20f7f908754585419117a'
      }
    };

    request.params.id = '5fdb3d3f36efda18b4b1701a'
    request.query.fields = '_id,name';

    await controllerFunc(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = json.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(json.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(bodyResult.user._id.toString()).to.equal(request.params.id);
    expect(bodyResult.user.name).to.equal('publisher_change');
    expect(bodyResult.user.additional).to.equal(undefined);
    expect(bodyResult.user.commission).to.equal(undefined);
    expect(bodyResult.user.enabled).to.equal(undefined);
    expect(bodyResult.user.connected_users).to.equal(undefined);
    expect(bodyResult.user.permissions).to.equal(undefined);
    expect(bodyResult.user.domains).to.equal(undefined);
    expect(bodyResult.user.cwe).to.equal(undefined);
    expect(bodyResult.user.am).to.equal(undefined);
    expect(bodyResult.user.sam).to.equal(undefined);
    expect(bodyResult.user.date_to_connect_am).to.equal(undefined);
    expect(bodyResult.user.previouslyUploadedReports).to.equal(undefined);
    expect(bodyResult.user.wbidType).to.equal(undefined);
    expect(bodyResult.user.wbidUserId).to.equal(undefined);
    expect(bodyResult.user.oRTBType).to.equal(undefined);
    expect(bodyResult.user.oRTBId).to.equal(undefined);
    expect(bodyResult.user.role).to.equal(undefined);
    expect(bodyResult.user.email).to.equal(undefined);
    expect(bodyResult.user.properties).to.equal(undefined);
    expect(bodyResult.user.photo).to.equal(undefined);
  });


  it('should get user canReadOwnPubs', async () => {
    request.body = {
      additional: {
        permission: 'canReadOwnPubs',
        id: '602cd4f220654b36b48fb696'
      }
    };

    request.params.id = '5fdcdceba2418c45d855a377';

    await controllerFunc(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = json.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(json.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(bodyResult.user._id.toString()).to.equal(request.params.id);
    expect(bodyResult.user.name).to.equal('publisher_domains');
    expect(bodyResult.user.email).to.equal('d@d.dd');
  });

  it('should get user with fields canReadOwnPubs', async () => {
    request.body = {
      additional: {
        permission: 'canReadOwnPubs',
        id: '602cd4f220654b36b48fb696'
      }
    };

    request.params.id = '5fdcdceba2418c45d855a377'
    request.query.fields = '_id,name';

    await controllerFunc(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = json.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(json.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(bodyResult.user._id.toString()).to.equal(request.params.id);
    expect(bodyResult.user.name).to.equal('publisher_domains');
    expect(bodyResult.user.additional).to.equal(undefined);
    expect(bodyResult.user.commission).to.equal(undefined);
    expect(bodyResult.user.enabled).to.equal(undefined);
    expect(bodyResult.user.connected_users).to.equal(undefined);
    expect(bodyResult.user.permissions).to.equal(undefined);
    expect(bodyResult.user.domains).to.equal(undefined);
    expect(bodyResult.user.cwe).to.equal(undefined);
    expect(bodyResult.user.am).to.equal(undefined);
    expect(bodyResult.user.sam).to.equal(undefined);
    expect(bodyResult.user.date_to_connect_am).to.equal(undefined);
    expect(bodyResult.user.previouslyUploadedReports).to.equal(undefined);
    expect(bodyResult.user.wbidType).to.equal(undefined);
    expect(bodyResult.user.wbidUserId).to.equal(undefined);
    expect(bodyResult.user.oRTBType).to.equal(undefined);
    expect(bodyResult.user.oRTBId).to.equal(undefined);
    expect(bodyResult.user.role).to.equal(undefined);
    expect(bodyResult.user.email).to.equal(undefined);
    expect(bodyResult.user.properties).to.equal(undefined);
    expect(bodyResult.user.photo).to.equal(undefined);
  });
});
