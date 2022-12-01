const { CriteoAPI } = require('./Criteo/index');
const { GoogleAdManagerAPI } = require('./Google_Ad_Manager/index');
const { Google_Ad_Manager_API_HB } = require('./Google_Ad_Manager_HB/gam-hb');
const { FacebookAPI } = require('./Facebook/index');
const { YandexAPI } = require('./Yandex/index');
const { AppNexusAndPartnersAPI } = require('./AppNexus/index');
const { MyTargetAPI } = require('./MyTarget/index');
const { PubMaticAPI } = require('./PubMatic/index');
const { RubiconAPI } = require('./Rubicon/index');
const { RTBHouseAPI } = require('./RTBHouse/index');
const { AmazonAPI } = require('./Amazon/index');
const { SmartAPI } = require('./Smart/index');
const { DistrictMAPI } = require('./DistrictM/index');
const { EPlanningAPI } = require('./EPlanning/index');
const { TeadsAPI } = require('./Teads/index');
const { IndexExchangeAPI } = require('./IndexExchange/index');
const { AdNetMediaAPI } = require('./AdNetMedia/index');
const { MediaNetAPI } = require('./MediaNet/index');
const { OneTagAPI } = require('./OneTag/index');
const { SharethroughAPI } = require('./Sharethrough/index');
const { LuponMediaAPI } = require('./LuponMedia/index');
const { programmaticConfigRetriever } = require('./config/programmaticConfigRetriever');

// TO DO

// 1. Rewrite programmatics on ts.
// 2. For programmatics create services and interfaces of it.
// 3. Use DI and implements ReportServerContract

// const possibleDates = ['date, dateRange, noDate'];

class ManageAPI {

  constructor() {
    this.apiAdapters = {
      'AdNet Media': {
        adapter: AdNetMediaAPI,
        type: 'dateRange'
      },
      Amazon: {
        adapter: AmazonAPI,
        type: 'date'
      },
      AppNexus: {
        adapter: AppNexusAndPartnersAPI,
        type: 'noDate'
      },
      bRealTime: {
        adapter: AppNexusAndPartnersAPI,
        type: 'noDate'
      },
      Criteo: {
        adapter: CriteoAPI,
        type: 'dateRange'
      },
      DistrictM: {
        adapter: DistrictMAPI,
        type: 'dateRange'
      },
      'E-Planning': {
        adapter: EPlanningAPI,
        type: 'date'
      },
      Facebook: {
        adapter: FacebookAPI,
        type: 'dateRange'
      },
      'Google Ad Manager WMG': {
        adapter: GoogleAdManagerAPI,
        type: 'dateRange'
      },
      'Google Ad Manager Commission': {
        adapter: GoogleAdManagerAPI,
        type: 'dateRange'
      },
      'Google Ad Manager MRG': {
        adapter: GoogleAdManagerAPI,
        type: 'dateRange'
      },
      'Google Ad Manager HB': {
        adapter: Google_Ad_Manager_API_HB,
        type: 'dateRange'
      },
      'Lupon Media': {
        adapter: LuponMediaAPI,
        type: 'date'
      },
      MyTarget: {
        adapter: MyTargetAPI,
        type: 'dateRange'
      },
      MediaNet: {
        adapter: MediaNetAPI,
        type: 'dateRange'
      },
      OneTag: {
        adapter: OneTagAPI,
        type: 'noDate'
      },
      IndexExchange: {
        adapter: IndexExchangeAPI,
        type: 'dateRange'
      },
      PubMatic: {
        adapter: PubMaticAPI,
        type: 'dateRange'
      },
      Rubicon: {
        adapter: RubiconAPI,
        type: 'dateRange'
      },
      RTBHouse: {
        adapter: RTBHouseAPI,
        type: 'dateRange'
      },
      Sharethrough: {
        adapter: SharethroughAPI,
        type: 'dateRange'
      },
      Smart: {
        adapter: SmartAPI,
        type: 'dateRange'
      },
      Teads: {
        adapter: TeadsAPI,
        type: 'dateRange'
      },
      Yandex: {
        adapter: YandexAPI,
        type: 'dateRange'
      }
    };
  }

  get apiList() {
    return Object.keys(this.apiAdapters).sort();
  }

  get adaptersAPIByType() {
    return Object.entries(this.apiAdapters).reduce((acc, adapter) => {
      acc.push({ programmatic: adapter[0], type: adapter[1].type });
      return acc;
    }, []);
  }

  runAPIUpload({ programmatic, dateFrom, dateTo }) {
    if (!this.isProgrammaticValid(programmatic)) {
      throw new Error('THERE\'S_NO_SUCH_PROGRAMMATIC');
    }
    const type = this.apiAdapters[programmatic].type;
    return this.runAPIByType(type, programmatic, dateFrom, dateTo);
  }

  isProgrammaticValid(programmatic) {
    return this.apiList.includes(programmatic);
  }

  runAPIByType(type, programmatic, dateFrom, dateTo) {
    switch (type) {
      case 'date':
        return this.runProgrammaticByDate(programmatic, dateFrom);
      case 'dateRange':
        return this.runProgrammaticByDateRange(programmatic, dateFrom, dateTo);
      case 'noDate':
        return this.runProgrammaticWithoutDate(programmatic);
      default:
        throw new Error('INVALID_PROGRAMMATIC_TYPE');
    }
  }

  runProgrammaticByDate(programmatic, dateFrom) {
    const config = programmaticConfigRetriever(programmatic);
    const api = new this.apiAdapters[programmatic].adapter(config);
    return dateFrom ? api.start(dateFrom) : api.start();
  }

  runProgrammaticByDateRange(programmatic, dateFrom, dateTo) {

    // // Exceptions for testing
    // if (programmatic === 'Google Ad Manager WMG') {
    //     const paramsOfGoogle = {
    //       queryId: '10283110737',
    //       networkSettings: { networkCode: "112081842", apiVersion: 'v202008' }
    //     };

    //     const api = new this.apiAdapters[programmatic].adapter(paramsOfGoogle);
    //     // Params for testing
    //     const params = {
    //       configname: 'testAddUnitt',
    //       size: {
    //         width: '320',
    //         height: '250'
    //       },
    //       targetWindow: 'BLANK',
    //       environmentType: 'BROWSER'
    //     }

    //     return api.start(dateFrom, dateTo, 'addUnit', params)
    // }

    const config = programmaticConfigRetriever(programmatic);
    const api = new this.apiAdapters[programmatic].adapter(config);
    return dateFrom && dateTo
      ? api.start(dateFrom, dateTo)
      : api.start();
  }

  runProgrammaticWithoutDate(programmatic) {
    const config = programmaticConfigRetriever(programmatic);
    const api = new this.apiAdapters[programmatic].adapter(config);
    return api.start();
  }
}

exports.ManageAPI = ManageAPI;

/*
 Implemented:
    - Amazon;                                   Can Accept One Date
    - AppNexus;                                 Cannot Accept Custom Dates
    - bRealTime;                                Cannot Accept Custom Dates
    - DistrictM;                                Accepts Custom Dates;
    - Criteo;                                   Accepts Custom Dates;
    - Facebook;                                 Accepts Custom Dates;
    - Google Ad Manager + HB + MRG              Can Accept Custom Dates;
    - PubMatic;                                 Accepts Custom Dates;
    - Rubicon                                   Accepts Custom Dates;
    - Smart;                                    Accepts Custom Dates;
    - Yandex;                                   Accepts Custom Dates;
    - Yandex WMG international;                 Accepts Custom Dates;
    - RTB House;                                Accepts Custom Dates;
    - Teads;                                    Accepts Custom Dates;
*/
