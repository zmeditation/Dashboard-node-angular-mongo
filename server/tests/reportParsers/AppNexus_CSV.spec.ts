const pathToFile = (__dirname + '/test-data/Appnexus_test_data.csv');
const { AppNexus_CSV } = require('../../server/modules/reporting/CSVUpload/objectParsers/AppNexus_CSV');
const parser = new AppNexus_CSV();
const csv = require('csvtojson');
import { expect } from 'chai';

describe('AppNexus_CSV report parsing', function () {

  it('Should correct parse AppNexus report file', async () => {
    const parsedData = await csv().fromFile(pathToFile);
    expect(parsedData).to.a('array');
    expect(parsedData.length).to.be.equal(67);
  });

  it('Should transform Adagio json to report object', async () => {
    const parsedData = await csv().fromFile(pathToFile);
    const transformed = parser.getReportsData(parsedData);
    expect(transformed[0].report_origin).to.equal('AppNexus');
    expect(transformed[0].ecpm).to.equal(1.16);
    expect(transformed[0].property.domain).to.equal('e.mail.ru');
  });

})
