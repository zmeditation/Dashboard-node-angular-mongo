const WBID = require("../../../server/http/controllers/wbidController");
import { expect} from 'chai';
const sinon = require("sinon");

describe('WBID Main Functionality Tests', () => {

  const additional = {
    id: '5fd9dc21af4ae2d75536f7d6',
    permission: 'canSeeAllWBidUsers',
    name: 'admin-laslo',
    role: 'ADMIN'
  }

  let res = {
    send: sinon.spy(),
    json: function (d) {
      return d;
    },
    status: function (s) {
      this.statusCode = s;
      return this;
    }
  };

  let addConfigRequest = {
    PREBID_TIMEOUT: 1500,
    adaptersList: "[\"ablida\"]",
    amazon: 'false',
    analytics: ["adWMG"],
    analyticsEnable: 'true',
    analyticsOptions: "{\"adWMG\":[{\"publisher_id\":\"5dc98166a2d111108c12ac5a\"},{\"site\":\"wmgroup.us\"},{\"adUnitId\":\"test_250x350\"}]}",
    cmp: 'false',
    configname: "test" + new Date().getMilliseconds(),
    currency: "",
    dashboardId: "5dc98166a2d111108c12ac5a",
    dev: 'false',
    devForm: "",
    domain: "wmgroup.us",
    floorPrice: 0.5,
    height: "350",
    logo: true,
    marketplace: 'false',
    method: "POST",
    name: "ixbt",
    passbacktag: "5f5f45f5f5rf5f",
    path: "/getShortTag",
    schain: 'false',
    settings: "{\"ablida\":{\"placementId\":{\"data\":\"45555\",\"type\":\"string\"},\"floorPrice\":{\"data\":\"0\",\"type\":\"float\"},\"cpmAdjustment\":{\"data\":\"0\",\"type\":\"float\"}}}",
    shortTag: 'true',
    siteId: "", // update before request
    sizes: "250x350",
    socketId: "aDoIDY2RjRNlmfduAAAI",
    typeOfConfig: "postbid",
    userId: "", // update before request
    width: "250",
    additional
  }

  let userId, siteId, configId, newConfigId, newConfigName;

  it('Preconditions - set user id, site id and config id for next tests', async () => {
    const req = {
      body: {
        method: 'GET',
        path: '/getUsersList',
        additional
      }
    }

    const result = await WBID.wBidManager(req, res); // get users list
    if (result.results.users.length) {
      for (const user of result.results.users) {
        if (user.domains.length && user.sites > 0) {
          userId = user.userData.id; // save id of selected user (with sites)
          break;
        }
      }
    }

    const req2 = {
      body: {
        method: 'GET',
        path: `/getUser/${ userId }`,
        additional
      }
    }

    const result2 = await WBID.wBidManager(req2, res); // get data of selected user
    const { sites } = result2.results.user;
    if (sites.length) {
      for (const site of sites) {
        if (site?.configs > 0) {
          siteId = site.id; // save id of selected site
          break;
        }
      }
    }

    const req3 = {
      body: {
        method: 'GET',
        path: `/getSite/${ siteId }`,
        additional
      }
    }

    const result3 = await WBID.wBidManager(req3, res); // get data of selected site
    const { configs } = result3.results;
    if (configs.length) {
      for (const config of configs) {
        configId = config.configid; // save id of selected config
        break;
      }
    }
  })

  it('Should get list of WBID users', async () => {
    const req = {
      body: {
        method: 'GET',
        path: '/getUsersList',
        additional
      }
    }

    const result = await WBID.wBidManager(req, res);
    expect(result).to.a('object');
    expect(result.success).to.be.true;
    expect(result.results.users).to.a('array');
    expect(result.results.users.length).to.be.greaterThan(0);
  });

  it('Should get list of bidders', async () => {
    const req = {
      body: {
        method: 'GET',
        path: '/getAllAdapters',
        additional
      }
    }

    const result = await WBID.wBidManager(req, res);
    expect(result).to.a('object');
    expect(result.success).to.be.true;
    expect(result.results).to.a('array');
    expect(result.results.length).to.be.greaterThan(50);
    expect(result.results).to.include('adWMG');
  });

  it('Should get list of analytic adapters', async () => {
    const req = {
      body: {
        method: 'GET',
        path: '/getAnalyticsList',
        additional
      }
    }

    const result = await WBID.wBidManager(req, res);
    expect(result).to.a('object');
    expect(result.success).to.be.true;
    expect(result.results).to.a('array');
    expect(result.results.length).to.be.greaterThan(30);
    expect(result.results).to.include('adWMG');
  });

  it('Should get single WBID user data', async () => {
    const req = {
      body: {
        method: 'GET',
        path: `/getUser/${ userId }`,
        additional
      }
    }

    const data = await WBID.wBidManager(req, res);
    expect(data).to.a('object');
    expect(data.success).to.be.true;
    expect(data.results.user).to.a('object');
    expect(data.results.user.id).to.a('number');
    expect(data.results.user.name).to.a('string');
  });

  it('Should get WBID site data', async () => {
    const req = {
      body: {
        method: 'GET',
        path: `/getSite/${ siteId }`,
        additional
      }
    }

    const data = await WBID.wBidManager(req, res);
    expect(data).to.a('object');
    expect(data.success).to.be.true;
    expect(data.results).to.a('object');
    expect(data.results.id).to.a('number');
    expect(data.results.domain).to.a('string');
    expect(data.results.configs).to.a('array');
  });

  it('Should get WBID config data', async () => {
    const req = {
      body: {
        method: 'GET',
        path: `/getconfig/${ configId }`,
        additional
      }
    }

    const data = await WBID.wBidManager(req, res);
    expect(data).to.a('object');
    expect(data.success).to.be.true;
    expect(data.results).to.a('object');
    expect(data.results.id).to.a('number');
    expect(data.results.config.name).to.a('string');
    expect(data.results.UserId).to.equal(userId);
    expect(data.results.SiteId).to.equal(siteId);
  });

  it('Should create new postbid config', async () => {
    addConfigRequest.userId = userId;
    addConfigRequest.siteId = siteId;

    const req = {
      body: addConfigRequest
    }

    const data = await WBID.wBidManager(req, res);
    expect(data).to.a('object');
    expect(data.success).to.be.true;
    expect(data.results).to.a('object');
    expect(data.results.tags.fulltag).to.a('string');
    expect(data.results.tags.fulltag).to.include('wmg-script-');
    newConfigId = data.results.id;
    newConfigName = data.name;
  });

  it('Should delete previously created config', async () => {
    const req = {
      body: {
        configName: newConfigName,
        id: newConfigId,
        method: "POST",
        path: "/deleteConfig",
        responseType: "text",
        siteId: siteId,
        additional
      }
    }

    const data = await WBID.wBidManager(req, res);
    expect(data).to.a('object');
    expect(data.success).to.be.true;
    expect(data.results).to.a('string');
    expect(data.results).to.equal(`Config ID ${ newConfigId } successfully deleted from DB`);
  })

})
