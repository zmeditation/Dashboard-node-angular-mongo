const faker = require('faker');
const { SSP_Domain } = require('../../server/modules/ortb/modules/reports/api/filters/res/pg/models');

const data = async (props = {}) => {
  const defaultProps = {
    id: faker.datatype.number(1000),
    sspId: faker.datatype.number(100),
    domain: faker.internet.domainName(),
    enable: faker.datatype.boolean(),
    qps_limit: 0
  };
  return Object.assign({}, defaultProps, props);
};

module.exports = async (props = {}) =>
  await SSP_Domain.create(await data(props));


