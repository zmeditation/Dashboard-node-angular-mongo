// const c = require('../../../services/reports/grpc/index');
import grpcService from '../../../../../services/grpc/index';
const PROTO_PATH = `${__dirname}/../protos/table.proto`;
const DimensionSetter = require('../../../services/reports/dimensions/index');
const MetricsReform = require('../../../services/reports/metrics/index');
const FilterReformer = require('../../../services/reports/filters/index');
const PermissionCheck = require('../../../services/reports/permissionCheck');
const serviceObject = { type: 'wbid', service: 'analytics', additional: 'charts' };

const endpoint = process.env.WBID_ANALYTICS_ENDPOINT;

class WBidAnalyticsReport extends PermissionCheck {
  constructor(args) {
    super(args);
  }

  async getResults(reportReq) {
    try {
      const reqBody = this.prepareReqBody(reportReq);
      const metrics = reportReq.metrics;
      let result = await new grpcService(reqBody, PROTO_PATH, endpoint, serviceObject).makeRequest('AnalyticTable');
      return this.reformResponse(result, reportReq.enumerate, reqBody.filters, metrics);
    } catch (err) {
      return {
        success: true,
        filterResult: [
          {
            dimensions: {},
            enumerate: true,
            groupMetricsData: [],
            metrics: {
              bids_won: 0,
              cpm: 0,
              fill_rate: 0,
              gross_revenue: 0,
              requests: 0
            }
          }
        ],
        dimensions: [],
        filters: [],
        msg: 'ERROR',
        total: {
          bids_won: 0,
          cpm: 0,
          fill_rate: 0,
          gross_revenue: 0,
          requests: 0
        }
      };
    }
  }

  prepareReqBody(fullBody) {
    if (fullBody.range !== 'custom') {
      fullBody.customRange = new MetricsReform(fullBody.range).editPeriodForReq();
    }
    const editFilters = new FilterReformer(fullBody.filters).setNames();

    return {
      filters: editFilters,
      groups: fullBody.dimensions,
      period_start: fullBody.customRange.dateFrom,
      period_end: fullBody.customRange.dateTo
    };
  }

  async reformResponse(response, enumerate, filters, metrics) {
    const ReformDimensions = new DimensionSetter(response.data, response.metrics);
    const dataWithDimensions = ReformDimensions.reform();
    const changeDimensionValuesPublishers = response.metrics.includes('publisher_id')
      ? await ReformDimensions.publisher_id(dataWithDimensions)
      : dataWithDimensions;
    const changeDimensionValuesMangers = response.metrics.includes('manager_id')
      ? await ReformDimensions.manager_id(changeDimensionValuesPublishers)
      : changeDimensionValuesPublishers;
    const ReformMetrics = new MetricsReform(changeDimensionValuesMangers, filters);
    const editMetricsData = ReformMetrics.roundInt(enumerate);
    const { filterResult, total } = ReformMetrics.filterDataByRequstedMetrics(metrics, editMetricsData, response['totalData'].metrics);
    return {
      success: true,
      filterResult,
      dimensions: response.metrics,
      filters: filters.map((el) => el.name),
      msg: 'SUCCESS',
      total
    };
  }
}

module.exports = WBidAnalyticsReport;
