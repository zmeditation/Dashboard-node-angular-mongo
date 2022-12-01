import { Types } from "mongoose";
import User from '../../../database/mongoDB/migrations/UserModel';
import grpcService from '../../../services/grpc/index';
const { handleErrors } = require("../../../services/helperFunctions/handleErrors");
const path = require('path');
const moment = require('moment');

export type FilterObject = {
  name: string,
  type: 'inc' | 'exc',
  data: string[]
}

export type GRPCRequestObject = {
  filters: FilterObject[],
  groups: string[],
  period_start: string,
  period_end: string
}

class UpdateUserStatus {

  private period: string;

  constructor(period: string) {
    this.period = period;
  }

  private period_start = this.startPeriod;
  private period_end = moment(new Date()).format('YYYY-MM-DD');

  private reqBody: GRPCRequestObject = {
    filters: [{ name: 'pub_id', type: 'inc', data: ['60'] }],
    groups: ['ssp_pub_id'],
    period_start: this.period_start,
    period_end: this.period_end
  }

  private PROTO_PATH = path.join(__dirname, '../../../modules/ortb/modules/reports/api/grpc/protos/rtb_table.proto');
  private endpoint = process.env.ORTB_ENDPOINT;
  private serviceObject = { type: 'rtb', service: 'analytics' };

  private get startPeriod(): string {
    return moment(new Date()).subtract(this.period, 1).format('YYYY-MM-DD');
  }

  async run(): Promise<void> | never {
    try {
      console.log('Start updating users for adWMG adapter status');
      let adWMGAdapterPubs: Array<any> = [];
      const result = await new grpcService(this.reqBody, this.PROTO_PATH, this.endpoint, this.serviceObject).makeRequest('AnalyticTable');
      const { data } = result;

      if (data) {
        for (const el of data) {
          adWMGAdapterPubs.push(el.groupMetricsData[0]);
        }
      }

      adWMGAdapterPubs = adWMGAdapterPubs.filter(id => !!id).map(id => Types.ObjectId(id));
      await User.updateMany({ _id: { $in: adWMGAdapterPubs } }, { adWMGAdapter: true }, { multi: true });
  } catch (error) {
      throw handleErrors(error, 'Error at UpdateUserStatus cron job', true);
    }
  }
}


module.exports = UpdateUserStatus;
