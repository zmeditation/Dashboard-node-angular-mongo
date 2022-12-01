const faker = require('faker');
const { DSP } = require('../../server/modules/ortb/modules/reports/api/filters/res/pg/models');

const data = async (props = {}) => {
  const defaultProps = {
    id: faker.datatype.number(10000),
    name: faker.company.companyName(),
    endpoint: faker.internet.url(),
    enable: true
  };
  return Object.assign({}, defaultProps, props);
};

module.exports = async (props = {}) =>
  await DSP.create(await data(props));


