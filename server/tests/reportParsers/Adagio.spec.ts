const pathToFile = (__dirname + '/test-data/Adagio_test_data.csv');
const { Adagio } = require('../../server/modules/reporting/CSVUpload/objectParsers/Adagio');
const parser = new Adagio();
const csv = require('csvtojson');
import { expect } from 'chai';

describe('Adagio report parsing', function () {

  it('Should correct parse Adagio report file', async () => {

    const parsedData = await csv().fromFile(pathToFile);
    expect(parsedData).to.a('array');
    expect(parsedData.length).to.be.equal(10);

  });

  it('Should transform Adagio json to report object', async () => {
    const parsedData = await csv().fromFile(pathToFile);
    const transformed = parser.getReportsData(parsedData);
    expect(transformed).to.a('array');
    expect(transformed.length).to.equal(10);
    expect(transformed[0].report_origin).to.equal('Adagio');
    expect(transformed[0].property.domain).to.equal('mail.ru');
  });
})

