import sinon from 'sinon';
import faker from 'faker';
import GetSSPPartners from '../../server/services/users/SSPPubs';
import GetDSPPartners from '../../server/services/users/DSPPubs';
import AddRTBUser from '../../server/services/users/AddRTBUser';
import { expect } from 'chai';
import { SSP, DSP } from '../../server/modules/ortb/modules/reports/api/filters/res/pg/models';

const getSSP = new GetSSPPartners();
const getDSP = new GetDSPPartners();
const request = { args: { body: { type: 'SSP', name: 'SSP_Name', secret_key: 'secret' } } };
const request2 = { args: { body: { type: 'DSP', name: 'DSP_Name', endpoint: faker.internet.url() } } };
const addSSPUser = new AddRTBUser(request);
const addDSPUser = new AddRTBUser(request2);

describe('User tools - work with partners', function () {
  it('Get list of SSP partners', () => {
    let res = { send: sinon.spy() };
    getSSP.run().then((data) => {
      expect(data).to.a('array');
      expect(data[0].id).to.a('number');
      expect(data[0]).to.have.all.keys('id', 'name', 'secret_key', 'enable');
    });
  });

  it('Get list of DSP partners', () => {
    let res = { send: sinon.spy() };
    getDSP.run().then((data) => {
      expect(data).to.a('array');
      expect(data[0].name).to.a('string');
      expect(data[0]).to.have.all.keys('id', 'name', 'enable');
    });
  });

  it('Create RTB Partner - SSP', async () => {
    let res = { send: sinon.spy() };
    addSSPUser.run().then((data) => {
      const user = data.result.dataValues;
      expect(data.success).to.be.true;
      expect(user).to.a('object');
      expect(user.name).to.a('string');
      expect(user.name).to.equal('SSP_Name');
      expect(user.enable).to.be.true;
    });

    await SSP.destroy({ where: { name: request.args.body.name } }); // clear test entry from db
  });

  it('Create RTB Partner - DSP', async () => {
    let res = { send: sinon.spy() };
    addDSPUser.run().then((data) => {
      const user = data.result.dataValues;
      expect(data.success).to.be.true;
      expect(user).to.a('object');
      expect(user.name).to.a('string');
      expect(user.name).to.equal('DSP_Name');
      expect(user.enable).to.be.true;
    });

    await DSP.destroy({ where: { name: request2.args.body.name } }); // clear test entry from db
  });
});
