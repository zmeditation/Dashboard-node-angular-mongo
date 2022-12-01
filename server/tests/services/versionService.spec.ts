import mongoose from '../fake-mongoose/mongooseFake';
import Validator from '../../server/utils/validator';
import GetLastVersionNotFoundException from '../../server/services/version/exceptions/getLastVersionNotFoundException';
import GetVersionInformationNotFoundException from '../../server/services/version/exceptions/getVersionInformationNotFoundException';
import { expect } from 'chai';
import { versionsData } from '../fake-db-data/versions';
import { versionService } from '../../server/providers/version/services';
import { ROLES } from '../../server/constants/roles';

describe('Version => VersionService', function () {
  const fakeCollections = {
    versions: versionsData
  };
  const superUser = ROLES.ADMIN;
  const insideUser = ROLES.AD_OPS;
  const outsideUser = ROLES.PUBLISHER;

  mongoose.prepareMongoUnit();

  before('Start fake mongodb server', async () => {
    await mongoose.connect();
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it('should throw error get last version', async () => {
    let result;

    try {
      await versionService.getLastVersion();
    } catch (error) {
      result = error;
    }

    expect(result instanceof GetLastVersionNotFoundException).to.be.true;

    await mongoose.setCollections({ fakeCollections });
  });

  it('should get last version', async () => {
    const { value } = await versionService.getLastVersion();

    expect(value).to.equal('v1.4.2.3');
  });

  it('should get version list inside users', async () => {
    const result = await versionService.getVersionList(insideUser);

    expect(result.length).to.equal(4);
  });

  it('should get version list outside users', async () => {
    const result = await versionService.getVersionList(outsideUser);

    expect(result.length).to.equal(1);
  });

  it('should get version information not found exception', async () => {
    const version = 'v2.2.2.3';
    let result;

    try {
      result = await versionService.getVersionInformation({
        version: version,
        userRole: superUser
      });
    } catch (error) {
      result = error;
    }

    expect(result instanceof GetVersionInformationNotFoundException).to.be.true;
  });

  it('should get version information super user', async () => {
    const version = 'v1.2.3.3';

    const result = await versionService.getVersionInformation({
      version: version,
      userRole: superUser
    });

    expect(Validator.mongoDBId(result._id.toString())).to.be.true;
    expect(result.version).to.equal(version);
    expect(result.releaseDate).to.equal('2021-07-10T21:00:00Z');
    expect(result.description.out).to.equal('qwefqwefqwef1234');
    expect(result.description.in).to.equal('qwefqwef11111');
  });

  it('should get version information super user with null out', async () => {
    const version = 'v1.2.2.3';

    const result = await versionService.getVersionInformation({
      version: version,
      userRole: superUser
    });

    expect(Validator.mongoDBId(result._id.toString())).to.be.true;
    expect(result.version).to.equal(version);
    expect(result.releaseDate).to.equal('2021-06-10T21:00:00Z');
    expect(result.description.out).to.equal('');
    expect(result.description.in).to.equal('qwefqwef11111');
  });

  it('should get version information super user with string description', async () => {
    const version = 'v1.1.1.1';

    const result = await versionService.getVersionInformation({
      version: version,
      userRole: superUser
    });

    expect(Validator.mongoDBId(result._id.toString())).to.be.true;
    expect(result.version).to.equal(version);
    expect(result.releaseDate).to.equal('2021-05-13T21:00:00Z');
    expect(result.description.out).to.equal('');
    expect(result.description.in).to.equal('Anime forever\nAnime');
  });

  it('shoult get version information inside user', async () => {
    const version = 'v1.2.3.3';

    const result = await versionService.getVersionInformation({
      version: version,
      userRole: insideUser
    });

    expect(Validator.mongoDBId(result._id.toString())).to.be.true;
    expect(result.version).to.equal(version);
    expect(result.releaseDate).to.equal('2021-07-10T21:00:00Z');
    expect(result.description).to.equal('qwefqwef11111');
  });

  it('should get version information inside user with null out', async () => {
    const version = 'v1.2.2.3';

    const result = await versionService.getVersionInformation({
      version: version,
      userRole: insideUser
    });

    expect(Validator.mongoDBId(result._id.toString())).to.be.true;
    expect(result.version).to.equal(version);
    expect(result.releaseDate).to.equal('2021-06-10T21:00:00Z');
    expect(result.description).to.equal('qwefqwef11111');
  });

  it('should get version information inside user with string description', async () => {
    const version = 'v1.1.1.1';

    const result = await versionService.getVersionInformation({
      version: version,
      userRole: insideUser
    });

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
    await versionService.createVersion(data);

    const result = await versionService.getVersionInformation({
      version: data.version,
      userRole: superUser
    });

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
    let result;

    await versionService.updateVersion(data);

    try {
      await versionService.getVersionInformation({
        version: data.lastVersion,
        userRole: superUser
      });
    } catch (error) {
      result = error;
    }

    expect(result instanceof GetVersionInformationNotFoundException).to.be.true;

    result = await versionService.getVersionInformation({
      version: data.newVersion,
      userRole: superUser
    });

    expect(result.version).to.equal(data.newVersion);
    expect(result.releaseDate.toString()).to.equal(data.releaseDate);
    expect(result.description.in).to.equal(data.description.in);
    expect(result.description.out).to.equal(data.description.out);
  });

  it('should delete version', async () => {
    const version = 'v1.1.1.1';
    let result;

    await versionService.deleteVersion(version);

    try {
      await versionService.getVersionInformation({
        version: version,
        userRole: superUser
      });
    } catch (error) {
      result = error;
    }

    expect(result instanceof GetVersionInformationNotFoundException).to.be.true;
  });
});
