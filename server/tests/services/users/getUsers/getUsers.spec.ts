import mongoose from '../../../fake-mongoose/mongooseFake';
import GetUsers from '../../../../server/services/users/getUsers/getUsers';
import ServiceRunner from '../../../../server/services/ServiceRunner';
import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { users } from '../../../fake-db-data/users';
import { domains } from '../../../fake-db-data/domains';
import { ROLES } from '../../../../server/constants/roles';
import { Response } from '../../../../server/interfaces/express';

describe('Services => Users => GetUsers', () => {
  const fakeCollections = {
    users,
    domains
  };
  let status;
  let send;
  let json;
  let request: any;
  let response: Response;
  const controllerFunc = ServiceRunner(GetUsers, (req: any) => {
    return { body: req.body, query: req.query };
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

  it('should search users', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllUsers',
        id: '5fd9dc21af4ae2d75536f7d6'
      }
    };
    request.query = {
      roles: '',
      search: 'adm',
      page: 1,
      limit: 10,
      step: 5,
      noRef: '',
      sort: '',
      include: '',
      indent: 0,
      fields: ''
    };

    await controllerFunc(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = json.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(json.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(bodyResult.countPages).to.equal(1);
    expect(bodyResult.totalRows).to.equal(2);
    expect(bodyResult.users.filter((user: any) => user.name === 'admin-laslo').length).to.equal(1);
    expect(bodyResult.users.filter((user: any) => user.name === 'admin2').length).to.equal(1);
  });

  it('should search users with pagination', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllUsers',
        id: '5fd9dc21af4ae2d75536f7d6'
      }
    };
    request.query = {
      roles: '',
      search: 'adm',
      page: 1,
      limit: 1,
      step: 1,
      noRef: '',
      sort: '',
      include: '',
      indent: 0,
      fields: ''
    };

    await controllerFunc(request, response);

    let statusResult = status.args[0][0];
    let bodyResult = json.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(json.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(bodyResult.countPages).to.equal(2);
    expect(bodyResult.totalRows).to.equal(2);
    expect(bodyResult.users.length).to.equal(1);
    expect(bodyResult.users.filter((user: any) => user.name === 'admin-laslo').length).to.equal(1);

    request.query.page = 2;

    await controllerFunc(request, response);

    statusResult = status.args[1][0];
    bodyResult = json.args[1][0];

    expect(statusResult).to.equal(200);
    expect(bodyResult.countPages).to.equal(2);
    expect(bodyResult.totalRows).to.equal(2);
    expect(bodyResult.users.length).to.equal(1);
    expect(bodyResult.users.filter((user: any) => user.name === 'admin2').length).to.equal(1);
  });

  it('should not search user', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllUsers',
        id: '5fd9dc21af4ae2d75536f7d6'
      }
    };
    request.query = {
      roles: '',
      search: 'admmmm',
      page: 1,
      limit: 1,
      step: 1,
      noRef: '',
      sort: '',
      include: '',
      indent: 0,
      fields: ''
    };

    await controllerFunc(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = json.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(json.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(bodyResult.countPages).to.equal(1);
    expect(bodyResult.totalRows).to.equal(0);
    expect(bodyResult.users.length).to.equal(0);
  });

  it('should search by role', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllUsers',
        id: '5fd9dc21af4ae2d75536f7d6'
      }
    };
    request.query = {
      roles: ROLES.PUBLISHER,
      search: 'pub',
      page: 1,
      limit: 2,
      step: 1,
      noRef: '',
      sort: '',
      include: '',
      indent: 0,
      fields: ''
    };

    await controllerFunc(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = json.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(json.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(bodyResult.countPages).to.equal(2);
    expect(bodyResult.totalRows).to.equal(4);
    expect(bodyResult.users.filter((user: any) => user.name === 'publisher_change').length).to.equal(1);
    expect(bodyResult.users.filter((user: any) => user.name === 'pub01').length).to.equal(1);
  });

  it('should search users getAllPubs', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllUsers',
        id: '5fd9dc21af4ae2d75536f7d6'
      }
    };
    request.query = {
      roles: '',
      search: 'pub',
      page: 1,
      limit: 2,
      step: 1,
      noRef: '',
      sort: '',
      include: '',
      indent: 0,
      fields: ''
    };

    await controllerFunc(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = json.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(json.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(bodyResult.countPages).to.equal(2);
    expect(bodyResult.totalRows).to.equal(4);
    expect(bodyResult.users.filter((user: any) => user.name === 'publisher_change').length).to.equal(1);
    expect(bodyResult.users.filter((user: any) => user.name === 'pub01').length).to.equal(1);
  });

  it('should search users canReadOwnPubs', async () => {
    request.body = {
      additional: {
        permission: 'canReadOwnPubs',
        id: '5ff43848f428a44ffc88f165'
      }
    };
    request.query = {
      roles: '',
      search: 'pub',
      page: 1,
      limit: 1,
      step: 1,
      noRef: '',
      sort: '',
      include: '',
      indent: 0,
      fields: ''
    };

    await controllerFunc(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = json.args[0][0];

    expect(status.calledOnce).to.be.true;
    expect(json.calledOnce).to.be.true;
    expect(statusResult).to.equal(200);
    expect(bodyResult.countPages).to.equal(1);
    expect(bodyResult.totalRows).to.equal(1);
    expect(bodyResult.page).to.equal(1);
    expect(bodyResult.users.filter((user: any) => user.name === 'publisher_new_dom').length).to.equal(1);
  });

  it('should get users with pagination canReadAllUsers', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllUsers',
        id: '5fd9dc21af4ae2d75536f7d6'
      }
    };
    request.query = {
      roles: [ROLES.PUBLISHER, ROLES.ACCOUNT_MANAGER, ROLES.SENIOR_ACCOUNT_MANAGER],
      search: '',
      page: 1,
      limit: 3,
      step: 1,
      noRef: '',
      sort: '',
      include: '',
      indent: 0,
      fields: ''
    };
    const usersByPages = [
      ['mail.ru', 'publisher_change', 'pub01'],
      ['publisher_new_dom', 'publisher_domains', 'simple_acc'],
      ['account1', 'acc_for_tests', 'incognito_acc'],
      ['minecraft', 'serious SAM', 'senior-acc']
    ];

    for (let i = 0; i < usersByPages.length; i++) {
      await controllerFunc(request, response);

      const statusResult = status.args[i][0];
      const bodyResult = json.args[i][0];
      const page = i + 1;

      if (i === 0) {
        expect(status.calledOnce).to.be.true;
        expect(json.calledOnce).to.be.true;
      }

      expect(statusResult).to.equal(200);
      expect(bodyResult).to.be.an('object');
      expect(bodyResult.countPages).to.be.an('number');
      expect(bodyResult.countPages).to.equal(4);
      expect(bodyResult.totalRows).to.be.an('number');
      expect(bodyResult.totalRows).to.equal(12);
      expect(bodyResult.page).to.be.an('number');
      expect(bodyResult.page).to.equal(page);
      expect(bodyResult.users).to.be.an('array');
      expect(bodyResult.users.length).to.equal(3);

      const usersByPage = usersByPages[i];

      for (let j = 0; j < request.query.limit; j++) {
        const shouldUser = usersByPage[j];
        const user = bodyResult.users[j].name;

        expect(shouldUser === user).to.be.true;
      }

      request.query.page++;
    }
  });

  it('should get users with pagination and sort canReadAllUsers', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllUsers',
        id: '5fd9dc21af4ae2d75536f7d6'
      }
    };
    request.query = {
      roles: [ROLES.PUBLISHER, ROLES.ACCOUNT_MANAGER, ROLES.SENIOR_ACCOUNT_MANAGER],
      search: '',
      page: 1,
      limit: 3,
      step: 1,
      noRef: '',
      sort: 'name:asc',
      include: '',
      indent: 0,
      fields: ''
    };
    const usersByPages = [
      ['acc_for_tests', 'account1', 'incognito_acc'],
      ['mail.ru', 'minecraft', 'pub01'],
      ['publisher_change', 'publisher_domains', 'publisher_new_dom'],
      ['senior-acc', 'serious SAM', 'simple_acc']
    ];

    for (let i = 0; i < usersByPages.length; i++) {
      await controllerFunc(request, response);

      const statusResult = status.args[i][0];
      const bodyResult = json.args[i][0];
      const page = i + 1;

      if (i === 0) {
        expect(status.calledOnce).to.be.true;
        expect(json.calledOnce).to.be.true;
      }

      expect(statusResult).to.equal(200);
      expect(bodyResult).to.be.an('object');
      expect(bodyResult.countPages).to.be.an('number');
      expect(bodyResult.countPages).to.equal(4);
      expect(bodyResult.totalRows).to.be.an('number');
      expect(bodyResult.totalRows).to.equal(12);
      expect(bodyResult.page).to.be.an('number');
      expect(bodyResult.page).to.equal(page);
      expect(bodyResult.users).to.be.an('array');
      expect(bodyResult.users.length).to.equal(3);

      const usersByPage = usersByPages[i];

      for (let j = 0; j < request.query.limit; j++) {
        const shouldUser = usersByPage[j];
        const user = bodyResult.users[j].name;

        expect(shouldUser === user).to.be.true;
      }

      request.query.page++;
    }
  });

  it('should get users with pagination and include canReadAllUsers', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllUsers',
        id: '5fd9dc21af4ae2d75536f7d6'
      }
    };
    request.query = {
      roles: [ROLES.PUBLISHER, ROLES.ACCOUNT_MANAGER, ROLES.SENIOR_ACCOUNT_MANAGER],
      search: '',
      page: 1,
      limit: 6,
      step: 1,
      noRef: '',
      sort: '',
      include: [
        {
          key: 'enabled.status',
          value: true,
          extraValue: false
        }
      ],
      indent: 0,
      fields: ''
    };

    await controllerFunc(request, response);

    let statusResult = status.args[0][0];
    let bodyResult = json.args[0][0];

    expect(statusResult).to.equal(200);
    expect(bodyResult).to.be.an('object');
    expect(bodyResult.countPages).to.be.an('number');
    expect(bodyResult.countPages).to.equal(2);
    expect(bodyResult.totalRows).to.be.an('number');
    expect(bodyResult.totalRows).to.equal(12);
    expect(bodyResult.page).to.be.an('number');
    expect(bodyResult.page).to.equal(1);
    expect(bodyResult.users).to.be.an('array');
    expect(bodyResult.users.length).to.equal(6);

    for (const user of bodyResult.users) {
      expect(user.enabled.status).to.be.true;
    }

    request.query.page = 2;

    await controllerFunc(request, response);

    statusResult = status.args[1][0];
    bodyResult = json.args[1][0];

    for (let i = 3; i < bodyResult.users.length; i++) {
      expect(bodyResult.users[i].enabled.status).to.be.false;
    }
  });

  it('should search users by domain', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllUsers',
        id: '5fd9dc21af4ae2d75536f7d6'
      }
    };
    request.query = {
      roles: ROLES.PUBLISHER,
      search: '.mail.ru',
      page: 1,
      limit: 10,
      step: 5,
      noRef: '',
      sort: '',
      include: '',
      indent: 0,
      fields: ''
    };
    const resultNames = ['mail.ru', 'publisher_change', 'pub01'];

    await controllerFunc(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = json.args[0][0];

    expect(statusResult).to.equal(200);
    expect(bodyResult).to.be.an('object');
    expect(bodyResult.countPages).to.be.an('number');
    expect(bodyResult.countPages).to.equal(1);
    expect(bodyResult.totalRows).to.be.an('number');
    expect(bodyResult.totalRows).to.equal(3);
    expect(bodyResult.page).to.be.an('number');
    expect(bodyResult.page).to.equal(1);
    expect(bodyResult.users).to.be.an('array');
    expect(bodyResult.users.length).to.equal(3);

    for (let i = 1; i < bodyResult.users.length; i++) {
      expect(bodyResult.users[i].name === resultNames[i]).to.be.true;
    }
  });

  it('should search users by domain with pagination', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllUsers',
        id: '5fd9dc21af4ae2d75536f7d6'
      }
    };
    request.query = {
      roles: ROLES.PUBLISHER,
      search: '.mail.ru',
      page: 1,
      limit: 2,
      step: 1,
      noRef: '',
      sort: '',
      include: '',
      indent: 0,
      fields: ''
    };
    const usersByPages = [['mail.ru', 'publisher_change'], ['pub01']];

    for (let i = 0; i < usersByPages.length; i++) {
      await controllerFunc(request, response);

      const statusResult = status.args[i][0];
      const bodyResult = json.args[i][0];
      const page = i + 1;

      if (i === 0) {
        expect(status.calledOnce).to.be.true;
        expect(json.calledOnce).to.be.true;
      }

      expect(statusResult).to.equal(200);
      expect(bodyResult).to.be.an('object');
      expect(bodyResult.countPages).to.be.an('number');
      expect(bodyResult.countPages).to.equal(2);
      expect(bodyResult.totalRows).to.be.an('number');
      expect(bodyResult.totalRows).to.equal(3);
      expect(bodyResult.page).to.be.an('number');
      expect(bodyResult.page).to.equal(page);
      expect(bodyResult.users).to.be.an('array');
      expect(bodyResult.users.length).to.equal(usersByPages[i].length);

      const usersByPage = usersByPages[i];

      for (let j = 0; j < usersByPage.length; j++) {
        const shouldUser = usersByPage[j];
        const user = bodyResult.users[j].name;

        expect(shouldUser === user).to.be.true;
      }

      request.query.page++;
    }
  });

  it('should search users by domain canReadAllPubs', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllPubs',
        id: '603f9c7e3b32680052260a53'
      }
    };
    request.query = {
      roles: ROLES.PUBLISHER,
      search: '.mail.ru',
      page: 1,
      limit: 10,
      step: 5,
      noRef: '',
      sort: '',
      include: '',
      indent: 0,
      fields: ''
    };
    const resultNames = ['mail.ru', 'publisher_change', 'pub01'];

    await controllerFunc(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = json.args[0][0];

    expect(statusResult).to.equal(200);
    expect(bodyResult).to.be.an('object');
    expect(bodyResult.countPages).to.be.an('number');
    expect(bodyResult.countPages).to.equal(1);
    expect(bodyResult.totalRows).to.be.an('number');
    expect(bodyResult.totalRows).to.equal(3);
    expect(bodyResult.page).to.be.an('number');
    expect(bodyResult.page).to.equal(1);
    expect(bodyResult.users).to.be.an('array');
    expect(bodyResult.users.length).to.equal(3);

    for (let i = 1; i < bodyResult.users.length; i++) {
      expect(bodyResult.users[i].name === resultNames[i]).to.be.true;
    }
  });

  it('should search users by domain with pagination canReadAllPubs', async () => {
    request.body = {
      additional: {
        permission: 'canReadAllPubs',
        id: '603f9c7e3b32680052260a53'
      }
    };
    request.query = {
      roles: ROLES.PUBLISHER,
      search: '.mail.ru',
      page: 1,
      limit: 2,
      step: 1,
      noRef: '',
      sort: '',
      include: '',
      indent: 0,
      fields: ''
    };
    const usersByPages = [['mail.ru', 'publisher_change'], ['pub01']];

    for (let i = 0; i < usersByPages.length; i++) {
      await controllerFunc(request, response);

      const statusResult = status.args[i][0];
      const bodyResult = json.args[i][0];
      const page = i + 1;

      if (i === 0) {
        expect(status.calledOnce).to.be.true;
        expect(json.calledOnce).to.be.true;
      }

      expect(statusResult).to.equal(200);
      expect(bodyResult).to.be.an('object');
      expect(bodyResult.countPages).to.be.an('number');
      expect(bodyResult.countPages).to.equal(2);
      expect(bodyResult.totalRows).to.be.an('number');
      expect(bodyResult.totalRows).to.equal(3);
      expect(bodyResult.page).to.be.an('number');
      expect(bodyResult.page).to.equal(page);
      expect(bodyResult.users).to.be.an('array');
      expect(bodyResult.users.length).to.equal(usersByPages[i].length);

      const usersByPage = usersByPages[i];

      for (let j = 0; j < usersByPage.length; j++) {
        const shouldUser = usersByPage[j];
        const user = bodyResult.users[j].name;

        expect(shouldUser === user).to.be.true;
      }

      request.query.page++;
    }
  });

  it('should search users by domain canReadOwnPubs', async () => {
    request.body = {
      additional: {
        permission: 'canReadOwnPubs',
        id: '602cd4f220654b36b48fb696'
      }
    };
    request.query = {
      roles: ROLES.PUBLISHER,
      search: 'ads.ok.ru',
      page: 1,
      limit: 10,
      step: 5,
      noRef: '',
      sort: '',
      include: '',
      indent: 0,
      fields: ''
    };
    const resultNames = ['pub01', 'publisher_domains'];

    await controllerFunc(request, response);

    const statusResult = status.args[0][0];
    const bodyResult = json.args[0][0];

    expect(statusResult).to.equal(200);
    expect(bodyResult).to.be.an('object');
    expect(bodyResult.countPages).to.be.an('number');
    expect(bodyResult.countPages).to.equal(1);
    expect(bodyResult.totalRows).to.be.an('number');
    expect(bodyResult.totalRows).to.equal(2);
    expect(bodyResult.page).to.be.an('number');
    expect(bodyResult.page).to.equal(1);
    expect(bodyResult.users).to.be.an('array');
    expect(bodyResult.users.length).to.equal(2);

    for (let i = 1; i < bodyResult.users.length; i++) {
      expect(bodyResult.users[i].name === resultNames[i]).to.be.true;
    }
  });

  it('should search users by domain with pagination canReadOwnPubs', async () => {
    request.body = {
      additional: {
        permission: 'canReadOwnPubs',
        id: '602cd4f220654b36b48fb696'
      }
    };
    request.query = {
      roles: ROLES.PUBLISHER,
      search: 'ads.ok.ru',
      page: 1,
      limit: 1,
      step: 1,
      noRef: '',
      sort: '',
      include: '',
      indent: 0,
      fields: ''
    };

    const usersByPages = [['pub01'], ['publisher_domains']];

    for (let i = 0; i < usersByPages.length; i++) {
      await controllerFunc(request, response);

      const statusResult = status.args[i][0];
      const bodyResult = json.args[i][0];
      const page = i + 1;

      if (i === 0) {
        expect(status.calledOnce).to.be.true;
        expect(json.calledOnce).to.be.true;
      }

      expect(statusResult).to.equal(200);
      expect(bodyResult).to.be.an('object');
      expect(bodyResult.countPages).to.be.an('number');
      expect(bodyResult.countPages).to.equal(2);
      expect(bodyResult.totalRows).to.be.an('number');
      expect(bodyResult.totalRows).to.equal(2);
      expect(bodyResult.page).to.be.an('number');
      expect(bodyResult.page).to.equal(page);
      expect(bodyResult.users).to.be.an('array');
      expect(bodyResult.users.length).to.equal(usersByPages[i].length);

      const usersByPage = usersByPages[i];

      for (let j = 0; j < usersByPage.length; j++) {
        const shouldUser = usersByPage[j];
        const user = bodyResult.users[j].name;

        expect(shouldUser === user).to.be.true;
      }

      request.query.page++;
    }
  });
});
