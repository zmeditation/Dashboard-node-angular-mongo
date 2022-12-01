const faker = require('faker');
const { SSP } = require('../../server/modules/ortb/modules/reports/api/filters/res/pg/models');

const data = async (props = {}) => {
  const defaultProps = {
    id: faker.datatype.number(),
    name: faker.company.companyName(),
    secret_key: faker.datatype.string(),
    enable: true,
    qps_limit: 0
  };
  return Object.assign({}, defaultProps, props);
};

module.exports = async (props = {}) =>
  await SSP.create(await data(props));


