import mongoose from '../../fake-mongoose/mongooseFake';
import Validator from '../../../server/utils/validator';
import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { versionsData } from '../../fake-db-data/versions';
import { versionController } from '../../../server/providers/version/controllers';
import { ROLES } from '../../../server/constants/roles';
import { Request, Response } from '../../../server/interfaces/express';

describe('Version => VersionController', function () {
  const fakeCollections = {
    versions: versionsData
  };
  const superUser = ROLES.ADMIN;
  const insideUser = ROLES.AD_OPS;
  const outsideUser = ROLES.PUBLISHER;
  let status;
  let send;
  let json;
  let request: Request;
  let response: Response;

  mongoose.prepareMongoUnit();

  before('Start fake mongodb server', async () => {
    await mongoose.connect();
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

  it('should not get last version', async () => {
    const actualBodyResult = {
      status: 404,
      error: {
        message: 'No dashboard versions available'
      }
    };

    await versionController.getLastVersion(request, response);

    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(404);
    expect(send.calledOnce).to.be.true;
    expect(send.args[0][0]).to.equal(JSON.stringify(actualBodyResult));

    await mongoose.setCollections({ fakeCollections });
  });

  it('should get last version', async () => {
    const actualBodyResult = {
      status: 200,
      data: { value: 'v1.4.2.3' }
    };

    await versionController.getLastVersion(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = send.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(send.calledOnce).to.be.true;
    expect(bodyResult).to.equal(JSON.stringify(actualBodyResult));
  });

  it('should get version list inside users', async () => {
    request.query = {
      userRole: insideUser
    };

    await versionController.getVersionsList(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(send.calledOnce).to.be.true;
    expect(bodyResult.data.length).to.equal(4);
  });

  it('should get version list outside users', async () => {
    request.query = {
      userRole: outsideUser
    };

    await versionController.getVersionsList(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(send.calledOnce).to.be.true;
    expect(bodyResult.data.length).to.equal(1);
  });

  it('should not get version information', async () => {
    const actualBodyResult = {
      status: 404,
      error: {
        message: 'Version not found'
      }
    };
    request.query = {
      version: 'v2.2.2.3',
      userRole: superUser
    };

    await versionController.getVersionInformation(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = send.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(404);
    expect(send.calledOnce).to.be.true;
    expect(bodyResult).to.equal(JSON.stringify(actualBodyResult));
  });

  it('should get version information super user', async () => {
    const version = 'v1.2.3.3';
    request.query = {
      version: version,
      userRole: superUser
    };

    await versionController.getVersionInformation(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.data;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(send.calledOnce).to.be.true;
    expect(Validator.mongoDBId(result._id.toString())).to.be.true;
    expect(result.version).to.equal(version);
    expect(result.releaseDate).to.equal('2021-07-10T21:00:00Z');
    expect(result.description.out).to.equal('qwefqwefqwef1234');
    expect(result.description.in).to.equal('qwefqwef11111');
  });

  it('should get version information super user with null out', async () => {
    const version = 'v1.2.2.3';
    request.query = {
      version: version,
      userRole: superUser
    };

    await versionController.getVersionInformation(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.data;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(send.calledOnce).to.be.true;
    expect(Validator.mongoDBId(result._id.toString())).to.be.true;
    expect(result.version).to.equal(version);
    expect(result.releaseDate).to.equal('2021-06-10T21:00:00Z');
    expect(result.description.out).to.equal('');
    expect(result.description.in).to.equal('qwefqwef11111');
  });

  it('should get version information super user with string description', async () => {
    const version = 'v1.1.1.1';
    request.query = {
      version: version,
      userRole: superUser
    };

    await versionController.getVersionInformation(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.data;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(send.calledOnce).to.be.true;
    expect(Validator.mongoDBId(result._id.toString())).to.be.true;
    expect(result.version).to.equal(version);
    expect(result.releaseDate).to.equal('2021-05-13T21:00:00Z');
    expect(result.description.out).to.equal('');
    expect(result.description.in).to.equal('Anime forever\nAnime');
  });

  it('shoult get version information inside user', async () => {
    const version = 'v1.2.3.3';
    request.query = {
      version: version,
      userRole: insideUser
    };

    await versionController.getVersionInformation(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.data;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(send.calledOnce).to.be.true;
    expect(Validator.mongoDBId(result._id.toString())).to.be.true;
    expect(result.version).to.equal(version);
    expect(result.releaseDate).to.equal('2021-07-10T21:00:00Z');
    expect(result.description).to.equal('qwefqwef11111');
  });

  it('should get version information inside user with null out', async () => {
    const version = 'v1.2.2.3';
    request.query = {
      version: version,
      userRole: insideUser
    };

    await versionController.getVersionInformation(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.data;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(send.calledOnce).to.be.true;
    expect(Validator.mongoDBId(result._id.toString())).to.be.true;
    expect(result.version).to.equal(version);
    expect(result.releaseDate).to.equal('2021-06-10T21:00:00Z');
    expect(result.description).to.equal('qwefqwef11111');
  });

  it('should get version information inside user with string description', async () => {
    const version = 'v1.1.1.1';
    request.query = {
      version: version,
      userRole: insideUser
    };

    await versionController.getVersionInformation(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.data;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(send.calledOnce).to.be.true;
    expect(Validator.mongoDBId(result._id.toString())).to.be.true;
    expect(result.version).to.equal(version);
    expect(result.releaseDate).to.equal('2021-05-13T21:00:00Z');
    expect(result.description).to.equal('Anime forever\nAnime');
  });

  it('should create version', async () => {
    const data = {
      version: 'v1.3.4.5',
      releaseDate: new Date().toString(),
      description: {
        in: 'inside',
        out: 'outside'
      }
    };
    request.body.params = data;

    await versionController.createVersion(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.data;
    result.releaseDate = new Date(result.releaseDate);

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(send.calledOnce).to.be.true;
    expect(Validator.mongoDBId(result._id.toString())).to.be.true;
    expect(result.version).to.equal(data.version);
    expect(result.releaseDate.toString()).to.equal(data.releaseDate);
    expect(result.description.in).to.equal(data.description.in);
    expect(result.description.out).to.equal(data.description.out);
  });

  it('should update version', async () => {
    const data = {
      lastVersion: 'v1.2.3.3',
      newVersion: 'v1.2.3.44',
      releaseDate: new Date().toString(),
      description: {
        in: 'inside',
        out: 'outside'
      }
    };
    request.body.params = data;

    await versionController.updateVersion(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.data;
    result.releaseDate = new Date(result.releaseDate);

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(send.calledOnce).to.be.true;
    expect(result.version).to.equal(data.newVersion);
    expect(result.releaseDate.toString()).to.equal(data.releaseDate);
    expect(result.description.in).to.equal(data.description.in);
    expect(result.description.out).to.equal(data.description.out);
  });

  it('should delete version', async () => {
    const version = 'v1.1.1.1';
    request.query.value = version;

    await versionController.deleteVersion(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = JSON.parse(send.args[0][0]);
    const result = bodyResult.data;

    expect(status.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(send.calledOnce).to.be.true;
  });
});
