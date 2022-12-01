const SSPDataFactory = require('../pgData/SSPFakeDataFactory');
const DSPDataFactory = require('../pgData/DSPFakeDataFactory');
const { SSP, DSP } = require('../../server/modules/ortb/modules/reports/api/filters/res/pg/models');
import { expect } from 'chai';

const getSSPTestData = async () => {
  return await SSPDataFactory();
}

const getDSPTestData = async () => {
  return await DSPDataFactory();
}

describe('', function () {
  it('Should generate new SSP', async () => {
    const SSPData = await getSSPTestData();
    expect(SSPData).to.a("object");
    expect(SSPData.dataValues?.name).to.a("string");
    expect(SSPData.dataValues?.name?.length).greaterThan(0);
    expect(SSPData.dataValues?.enable).to.be.true;

    await SSP.destroy({ where: { id: SSPData.dataValues.id } }); // clear test entry from db
  });

  it('Should generate new DSP', async () => {
    const DSPData = await getDSPTestData();
    expect(DSPData).to.a("object");
    expect(DSPData.dataValues?.name).to.a("string");
    expect(DSPData.dataValues?.name?.length).greaterThan(0);

    await DSP.destroy({ where: { id: DSPData.dataValues.id } });
  });

})
