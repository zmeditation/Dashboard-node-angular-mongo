const path = require('path');
const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;
const { writeFile } = require('../../server/services/API/GoogleAdManager/helperFuncForAdManager/helper');
const { helperToReadFile } = require('../../server/services/helperFunctions/workWithFiles');


describe('Work With File System', () => {
  const testFilePath = path.join(__dirname, './testFile.json');
  const notExistFile = './notExistFile';

  it('Write testFile.json', async() => {
    const array = ['return', 'strings', 'of', 'Ad Units'];
    const data = JSON.stringify(array);
    const { error } = await writeFile(testFilePath, data);
    expect( error ).to.be.null; 
  });

  it('Reading testFile.json', async() => {
    helperToReadFile(testFilePath)
      .then( res => {
        const { data: adUnits, error } = res;
        const arrayAdUnit = JSON.parse(adUnits);

        expect(arrayAdUnit).to.be.a('array');
        expect(arrayAdUnit).to.include.members(['return', 'strings', 'of', 'Ad Units']);
        expect( error ).to.be.null;
      })
      .catch(console.log);
  });

  it(`unlink file ${testFilePath}`, () => {
    fs.unlink(testFilePath, (err) => {
      expect(err).to.be.null;
      if (err) throw err;
    });
  })

  it('Reading not exist file.', async() => {

    helperToReadFile(notExistFile)
    .catch(err => {
      expect(err).to.be.a('object')
      expect(err).to.have.ownProperty('error')
      const error = err.error;
      expect(error).to.have.deep.property('msg');
      expect(error.msg).to.have.string('Not found file by path')
    });
  });
});