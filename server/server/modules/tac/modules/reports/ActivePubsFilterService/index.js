const { ServerError } = require('../../../../../handlers/errorHandlers');
import grpcService from '../../../../../services/grpc';
const PROTO_PATH_PUB = `${__dirname}../../grpc/protos/tac_active.proto`;
const endpoint = process.env.TAC_ENDPOINT;
const serviceObject = { type: 'tac', service: 'analytics' };

class ActivePubsFilter {
  constructor() {}

  async run() {
    try {
      const adUnitsList = await new grpcService({ groups: ['ad_unit_code'] }, PROTO_PATH_PUB, endpoint, serviceObject).makeRequest(
        'AnalyticActive'
      );
      let result;
      if (adUnitsList && adUnitsList['groupMetricsRow'] && adUnitsList['groupMetricsRow'].length) {
        result = adUnitsList['groupMetricsRow'].map((res) => res['groupMetricsData'][0]);
      }
      return {
        success: true,
        name: 'AD_UNITS',
        results: result
      };
    } catch (e) {
      console.log(e.message || e);
      throw new ServerError(e);
    }
  }
}

module.exports = ActivePubsFilter;
