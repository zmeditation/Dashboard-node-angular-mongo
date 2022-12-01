import mongoose from '../../../fake-mongoose/mongooseFake';
import { testUsersService } from '../../../../server/providers/users/services';
import { expect } from 'chai';
import { users } from '../../../fake-db-data/users';
import { ROLES } from '../../../../server/constants/roles';

describe('Sercice => Users => TestUsersService', () => {
  const fakeCollections = {
    users
  };

  mongoose.prepareMongoUnit();

  before('Start fake mongodb server', async () => {
    await mongoose.connect();
    await mongoose.setCollections({ fakeCollections });
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it('should get test users by roles', async () => {
    const shouldResult = ['publisher_change', 'publisher_new_dom', 'account1', 'minecraft'];
    const result = await testUsersService.getTestUsers({
      roles: [ROLES.ACCOUNT_MANAGER, ROLES.PUBLISHER]
    });

    expect(result).to.be.an('array');
    expect(result.length).to.equal(4);

    for (let i = 0; i < shouldResult.length; i++) {
      expect(result[i].name).to.equal(shouldResult[i]);
    }
  });
});
