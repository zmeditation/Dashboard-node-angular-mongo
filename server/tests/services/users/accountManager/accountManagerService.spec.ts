import mongoose from '../../../fake-mongoose/mongooseFake';
import GetAccoutManagersRolesValidationException from '../../../../server/services/users/accountManager/exceptions/getAccoutManagersRolesValidationException';
import { expect } from 'chai';
import { accountManagerService } from '../../../../server/providers/users/accountManager/services';
import { users } from '../../../fake-db-data/users';
import { ROLES, ACCOUNT_MANAGER_ROLES } from '../../../../server/constants/roles';
import { GetAccountManagersParametersType } from '../../../../server/services/users/accountManager/types';

describe('Sercice => Users => AccountManager', () => {
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

  it('should get account managers', async () => {
    const result = await accountManagerService.getAccountManagers({
      roles: ACCOUNT_MANAGER_ROLES
    });

    expect(result).to.be.an('array');
    expect(result.length).to.equal(7);

    for (const user of result) {
      expect(ACCOUNT_MANAGER_ROLES.includes(user.role)).to.be.true;
    }
  });

  it('shoult get account managers with include', async () => {
    const result = await accountManagerService.getAccountManagers({
      roles: ACCOUNT_MANAGER_ROLES,
      include: [{
        key: 'enabled.status',
        value: 'true'
      }]
    });

    expect(result).to.be.an('array');
    expect(result.length).to.equal(5);

    for (const user of result) {
      expect(ACCOUNT_MANAGER_ROLES.includes(user.role)).to.be.true;
      expect(user.enabled).to.be.true;
    }
  });

  it('should get account managers with sort', async () => {
    const data: GetAccountManagersParametersType = {
      roles: ACCOUNT_MANAGER_ROLES,
      include: [{
        key: 'enabled.status',
        value: 'true'
      }]
    };
    const users = await accountManagerService.getAccountManagers(data);
    users.sort((a, b) => {
      return a.name < b.name ? -1 : 1;
    });
    data.sort = 'name:asc';
    const result = await accountManagerService.getAccountManagers(data);

    expect(users.length === result.length).to.be.true;

    for (let i = 0; i < users.length; i++) {
      expect(users[i].name === result[i].name).to.be.true;
    }
  });

  it('should role validation error', async () => {
    let result;

    try {
      result = await accountManagerService.getAccountManagers({
        roles: [...ACCOUNT_MANAGER_ROLES, ROLES.AD_OPS]
      });
    } catch (error) {
      result = error;
    }

    expect(result instanceof GetAccoutManagersRolesValidationException).to.be.true;
  })
});
