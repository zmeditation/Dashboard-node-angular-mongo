import ServiceRunner from '../../server/services/ServiceRunner';
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require("sinon");
const AdUnitAPI = require('../../server/services/API/GoogleAdManager/AddUnit/AddUnit');
const { toCollectAdUnit } = require('../../server/services/API/GoogleAdManager/helperFuncForAdManager/helper');

describe('Crete Ad Unit Object', () => {
    const configname = 'configname';
    const width = '100';
    const height = '100';
    const parentId = "111081962";
    const targetWindow = 'TOP';
    const environmentType = 'VIDEO_PLAYER';
    const isFluid = false;

    it('Pass all parameters and retrieve Ad Unit object.', () => {
      const newAdUnit = toCollectAdUnit({ configname, width, height, targetWindow, environmentType, parentId, isFluid });
      testCreateAdUnit(newAdUnit);
    });

    it('Pass only required parameters.', () => {
      const newAdUnit = toCollectAdUnit({ configname, width, height });
      testCreateAdUnit(newAdUnit);
    });
});

const checkError = (error, expectString) => {
  const { statusCode, statusMessage, customText, error: er } = error;
  expect(statusCode).to.be.a('number');
  expect(statusMessage).to.be.a('string');
  expect(customText).to.be.a('string');
  expect(er).to.equal(expectString);
}

describe('Create Ad Unit', () => {

  const serverFunc = ServiceRunner(AdUnitAPI, (req) => { return { body: req.body }});
  let res = undefined;

  beforeEach(() => {
    res = { send: sinon.spy() };
  })

  it('Handle error "Incorrect ConfigName".', async() => {
    const req = {
      body: {
        additional: { permission: 'canCreateNewAdUnit' },
        adUnitParams: {
          size: { width: '100', height: '100' },
          targetWindow: "BLANK", environmentType: "BROWSER"
        }
      }
    };

    serverFunc(req, res)
      .catch( error => {
        checkError(error, 'Error, configname is not specified.');
      })
  });

  it('Handle error "Incorrect Height".', async() => {
    const req = {
      body: {
        additional: { permission: 'canCreateNewAdUnit' },
        adUnitParams: {
          configname: "testAdUnit_50", size: { width: '100' },
          targetWindow: "BLANK", environmentType: "BROWSER"
        }
      }
    };

    serverFunc(req, res)
      .catch( error => {
        checkError(error, 'Error, incorrect height value.');
      })
  });

  it('Handle error "Incorrect Width".', async() => {
    const req = {
      body: {
        additional: { permission: 'canCreateNewAdUnit' },
        adUnitParams: {
          configname: "testAdUnit_50", size: { width: '', height: '100' },
          targetWindow: "BLANK", environmentType: "BROWSER"
        }
      }
    };

    serverFunc(req, res)
      .catch( error => {
        checkError(error, 'Error, incorrect width value.');
      })
  });

  it('Handle error "Incorrect Width And Height".', async() => {
    const req = {
      body: {
        additional: { permission: 'canCreateNewAdUnit' },
        adUnitParams: {
          configname: "testAdUnit_50", size: { width: "width", height: "height" },
          targetWindow: "BLANK", environmentType: "BROWSER"
        }
      }
    };

    serverFunc(req, res)
      .catch(error => {
        checkError(error, 'Error, incorrect width and height values.');
      })
  });
});

const testCreateAdUnit = (newAdUnitObj) => {
  expect(newAdUnitObj).to.be.a('object');
  expect(newAdUnitObj.adUnits).to.be.a('array');
  expect(newAdUnitObj.adUnits[0]).to.be.a('object');
  expect(newAdUnitObj.adUnits[0]).to.have.all
    .keys('parentId', 'name', 'targetWindow', 'adUnitCode', 'adUnitSizes', 'isFluid');

  const { parentId: parert, name: unitName, targetWindow: target, adUnitCode: code, adUnitSizes: adSize } = newAdUnitObj.adUnits[0];
  const { environmentType: enType, fullDisplayString: fullStr, size: { width: unitWidth, height: unitHeight }} = adSize[0];
  expect(adSize).to.be.a('array');

  [parert, unitName, target, code, enType, fullStr, unitWidth, unitHeight].forEach( str => assert.isString(str, 'All element must be a string.'));
}