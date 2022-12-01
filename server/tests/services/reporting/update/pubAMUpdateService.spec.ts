import mongoose from '../../../fake-mongoose/mongooseFake';
import PubAMUpdateService from '../../../../server/services/reporting/update/pubAMUpdate/pubAMUpdateService';
import GetPubUpdateDataMDBException from '../../../../server/services/reporting/update/pubAMUpdate/exceptions/getPubUpdateDataMDBException';
import { expect } from 'chai';
import { reports } from '../../../fake-db-data/reports';
import { users } from '../../../fake-db-data/users';

class PubAMUpdateServiceTest extends PubAMUpdateService {
  public setLimit(value: number): void {
    this.limit = value;
  }
}

describe('Reporting => Update => PubAMUpdateService', () => {
  const fakeCollections = {
    reports,
    users
  };
  const service = new PubAMUpdateServiceTest();

  mongoose.prepareMongoUnit();

  beforeEach(async () => {
    await mongoose.connect();
    await mongoose.setCollections({ fakeCollections });
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  it('should update reports with iterator', async () => {
    const limit = 3;
    const id = '5fd9e3ddaf4ae2d75536f7d7';
    const reportsLength = reports.filter((el) => el.property.refs_to_user.toString() === id).length;
    let updatedItemsLength = 0;

    service.setLimit(limit);

    for await (let data of service.update(id)) {
      expect(data.completed).to.be.an('boolean');

      if (data.completed) {
        expect(data.countUpdatedItems === reportsLength).to.be.true;
        expect(data.countUpdatedItems === updatedItemsLength).to.be.true;
      } else {
        expect(data.updatedItemsPerLimit <= limit).to.be.true;
        updatedItemsLength += data.updatedItemsPerLimit;
      }
    }
  });

  it('should update reports without iterator', async () => {
    const id = '5fd9e3ddaf4ae2d75536f7d7';
    const reportsLength = reports.filter((el) => el.property.refs_to_user.toString() === id).length;

    service.setLimit(30);

    for await (let data of service.update(id)) {
      expect(data.completed).to.be.an('boolean');
      expect(data.completed).to.be.true;
      expect(data.countUpdatedItems === reportsLength).to.be.true;
    }
  });

  it('should get error pub id', async () => {
    const id = '6fd9e3ddaf4ae2d75536f7d7';
    let errorResult = null;

    try {
      for await (let data of service.update(id)) {
      }
    } catch (error) {
      errorResult = error;
    }

    expect(errorResult instanceof GetPubUpdateDataMDBException).to.be.true;
  });
});
