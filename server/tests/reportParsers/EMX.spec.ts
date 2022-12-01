const pathToFile = (__dirname + '/test-data/EMX_Test_Data.csv');
const csv = require('csvtojson');
const { EMX } = require('../../server/modules/reporting/CSVUpload/objectParsers/EMX');
const parser = new EMX();
import { expect } from 'chai';

describe('EMX report parsing', function () {

  it('Should correct parse EMX report file', async () => {

    const parsedData = await csv().fromFile(pathToFile);
    expect(parsedData).to.a('array');
    expect(parsedData.length).to.be.equal(42);

  });

  it('Should transform EMX json to report object', async () => {
    const parsedData = await csv().fromFile(pathToFile);
    const transformed = parser.getReportsData(parsedData);
    expect(transformed[0].report_origin).to.equal('EMX');
  });

})
