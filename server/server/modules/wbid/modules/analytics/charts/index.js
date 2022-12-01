const mongoose = require('mongoose');
const User = mongoose.model('User');
const Base = require('../../../../../services/Base');
const { ServerError } = require('../../../../../handlers/errorHandlers');
const PROTO_PATH = `${__dirname}/../protos/charts.proto`;
import grpcService from '../../../../../services/grpc/index';
const CountriesISO = require('../../../services/reports/getCountries/countries.json');
const serviceObject = { type: 'wbid', service: 'analytics', additional: 'charts' };
const endpoint = process.env.WBID_ANALYTICS_ENDPOINT;

class WBidAnalyticsCharts extends Base {
  constructor(args) {
    super(args);
  }

  async execute(args) {
    const {
      body: {
        additional: { permission, id: userId }
      }
    } = args;
    try {
      let result = undefined,
        finishResult = undefined;
      const PubOrNotPub = await this.checkUser(userId),
        reqBody = await this.setReqBody(args.body, PubOrNotPub),
        construct = new grpcService(reqBody, PROTO_PATH, endpoint, serviceObject);
      switch (permission) {
        case 'canSeeWBidChartsPage':
          result = await construct.makeRequest('Dashboard');
          finishResult = this.finishResponse(result);
          break;
        case 'canSeeAllWBidUsers':
          result = await construct.makeRequest('Dashboard');
          finishResult = this.finishResponse(result);
          break;
        default:
          throw new ServerError('FORBIDDEN', 'FORBIDDEN');
      }
      return {
        success: true,
        result: finishResult
      };
    } catch (err) {
      throw {
        success: false,
        error: err
      };
    }
  }

  intRounding(arr) {
    return arr.map((int) => Math.round(int * 100) / 100);
  }

  async checkUser(id) {
    const result = await User.find({ _id: id }).then((user) => {
      if (user[0].role === 'PUBLISHER') {
        return [user[0]._id.toString()];
      } else if (user[0].role === 'ACCOUNT MANAGER' || user[0].role === 'SENIOR ACCOUNT MANAGER') {
        return user[0].connected_users.p;
      } else {
        return [];
      }
    });
    return result;
  }

  setReqBody(args, pub_id) {
    const { period_start, period_end, label_metric, limit, data_metric, site, ad_unit, publisher_id } = args;
    return {
      period_start,
      period_end,
      label_metric,
      data_metric,
      publisher_id: publisher_id.length ? publisher_id : pub_id,
      site: this.parseSite(site),
      ad_unit,
      limit: +limit
    };
  }

  parseSite(siteArr) {
    if (siteArr !== '') {
      return siteArr.map((site) => {
        const domain = site.replace(/^(https:\/\/(w{3}\.|)|http:\/\/(w{3}\.|))/gi, '');
        return domain.replace(/\//g, '');
      });
    }
    return siteArr;
  }

  countriesChange(labels) {
    CountriesISO.forEach((el) => {
      if (labels.includes(el.code)) {
        const indexLabel = labels.indexOf(el.code);
        labels[indexLabel] = el.name;
      }
    });
    return labels;
  }

  finishResponse(response) {
    return {
      pie: {
        datasets: [
          {
            data: this.intRounding(response.pie.data)
          }
        ],
        labels: this.countriesChange(response.pie.label),
        type: 'pie'
      },
      line: {
        datasets: response.line,
        labels: response.line.length > 0 ? response.line[0].dates : '',
        type: 'line'
      }
    };
  }
}

module.exports = WBidAnalyticsCharts;
