import ServiceRunner from '../../server/services/ServiceRunner';
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require("sinon");
import fsPromise from 'fs/promises';
const GetAdUnits = require('../../server/services/API/GoogleAdManager/GetAdUnits/GetAdUnits');
import WritingAdUnitsInfoSmall from '../../server/services/API/GoogleAdManager/WritingAdUnitsInfo/writingAdUnitInfoSmall'


const runTestWriteAllAdUnits = (testFilePath) => {
  it('Write Array Of All Ad Unit Names', async() => {
      const writeAdUnit = new WritingAdUnitsInfoSmall();

      const { arrayOfParams, error } = await writeAdUnit.writeAdUnitNames(testFilePath);
      expect(arrayOfParams).to.be.a('array');
      expect(arrayOfParams).to.not.be.empty;
      arrayOfParams.forEach( str => assert.isString(str, 'All element must be a string'));
      expect(error).to.be.null;
      
      const data = JSON.stringify(arrayOfParams);
      await fsPromise.writeFile(testFilePath, data);
  });
}


// Run the tests only on localhost
xdescribe('Get All Ad Units', () => {
    const permission = 'canGetAdUnit';
    const queryType = 'NEW AD UNITS'; // Query type for get data from server
    const parentId = '111081962';

    const serverFunc = ServiceRunner(GetAdUnits, (req) => { return { body: req.body }});
    let res = undefined;

    beforeEach(() => {
        res = { send: sinon.spy() };
    })

    const allAddUnitsFile = path.join(__dirname, './testAdUnitsNames.json');
    runTestWriteAllAdUnits(allAddUnitsFile);

    it('Get Ad Units from file.', async() => {
      try {
        const req = {
          body: { additional: { permission }, query: { queryType: 'FILE', parentId }  }
        };
        
        await serverFunc(req, res);

        const response = res.send.firstCall.args;
        expect(response).to.be.a('array');
        const { success, resultOfAdUnits } = response[0];
        expect(success).to.be.true;
        expect(resultOfAdUnits).to.be.a('array');
        resultOfAdUnits.forEach(str => assert.isString(str, 'All element must be a string.'));
      } catch (error) {
        throwError(error.message);
      }
    });

    // Most longer test
    it('Get Ad Units from server.', async() => {
        const req = {
            body: { additional: { permission }, query: { queryType, parentId } }
        };

        await serverFunc(req, res)
        .then( () => {
            const response = res.send.firstCall.args;
            expect(response).to.be.a('array');
            const { success, resultOfAdUnits } = response[0];
            expect(success).to.be.true;
            expect(resultOfAdUnits).to.be.a('array');
            resultOfAdUnits.forEach( str => assert.isObject(str, 'All element must be a object.'));
        })
        .catch(res => throwError(res.message));
    });

    describe('Check errors', () => {

        it('Handle Error "Invalid parentId"', async() => {
            const req = {
                body: {
                    additional: { permission },
                    query: { queryType, parentId: '11108ss25967' }
                }
            };

            await serverFunc(req, res)
            .then(() => {
                console.log("run server")
            })
            .catch(err => {
                expect(err.message).to.contain('Invalid query parameters');
            });
        });

        it('Handle Error "Not found children by parantId."', async() => {
            const req = {
                body: {
                    additional: { permission },
                    query: { queryType, parentId }
                }
            };

            await serverFunc(req, res)
            .then(() => {
                console.log("run server")
            })
            .catch(err => {
                expect(err.message).to.equal('Not found children by parantId.');
            });
        });
    });
});


const throwError = (errorString) => { throw new TypeError(errorString) };
