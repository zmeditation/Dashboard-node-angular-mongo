import grpcService from '../../../../../services/grpc/index';
const PROTO_PATH = `${ __dirname }/grpc/protos/rtb_table.proto`;
const DimensionsSetter = require('./dimensions');
const MetricsReformer = require('./metrics');
const FilterReformer = require('./filters');
const PermissionCheck = require('./permissionsCheck');
const serviceObject = { type: 'rtb', service: 'analytics' };
const endpoint = process.env.ORTB_ENDPOINT;
import { oRtbMetricsMapping as mapping } from '../../../../../constants/reports';

class OrtbAnalyticsReport extends PermissionCheck {
  constructor(args) {
    super(args);
  }

  async getResults(reportReq) {
    const { oRTBType } = this.parameters?.body?.additional;
    try {
      const reqBody = this.prepareReqBody(reportReq);
      const metrics = reportReq.metrics;
      let result = await new grpcService(reqBody, PROTO_PATH, endpoint, serviceObject).makeRequest('AnalyticTable');
      return this.reformResponse(result, reportReq.enumerate, reqBody.filters, metrics);
    } catch (err) {
      return {
        success: true,
        type: 'ortb',
        filterResult: [{
          dimensions: {},
          enumerate: true,
          groupMetricsData: [],
          metrics: this.updateMetricsForPartners(reportReq.metrics, oRTBType)
        }],
        dimensions: [],
        filters: [],
        msg: 'ERROR',
        total: this.updateMetricsForPartners(reportReq.metrics, oRTBType)
      }
    }
  }

  prepareReqBody(fullBody) {
    if (fullBody.range !== 'custom') {
      fullBody.customRange = new MetricsReformer(fullBody.range).editPeriodForReq();
    }
    const editFilters = new FilterReformer(fullBody.filters).setNames();

    return {
      filters: editFilters,
      groups: fullBody.dimensions,
      period_start: fullBody.customRange.dateFrom,
      period_end: fullBody.customRange.dateTo
    }
  }

  async reformResponse(response, enumerate, filters, metrics) {
    const ReformDimensions = new DimensionsSetter(response.data, response.metrics);
    const dataWithDimensions = ReformDimensions.reform();
    let _metrics;
    if (response.metrics.includes('ssp_pub_id') || response.metrics.includes('pub_id')) {
      let updatedData;
      if (response.metrics.includes('ssp_pub_id')) {
        updatedData = await ReformDimensions.reformSspId(dataWithDimensions, 'ssp_pub_id');
      }
      if (response.metrics.includes('pub_id')) {
        updatedData = await ReformDimensions.reformSspId(dataWithDimensions, 'pub_id');
      }
      _metrics = new MetricsReformer(updatedData, filters);
    } else {
      _metrics = new MetricsReformer(dataWithDimensions, filters);
    }
    const metricsData = _metrics.roundInt(enumerate);
    const totalMetrics = _metrics.totalMetrics(response['totalData'].metrics);
    for (const t of Object.keys(totalMetrics)) {
      if (!metrics.includes(t)) {
        delete totalMetrics[t];
      }
    }
    if (Array.isArray(metricsData) && metricsData.length) {
      metricsData.forEach(data => {
        for (let m of Object.keys(data.metrics)) {
          if (!metrics.includes(m)) {
            delete data.metrics[m];
          }
        }
      })
    }
    return {
      success: true,
      filterResult: metricsData,
      dimensions: response.metrics,
      filters: filters.map(el => el.name),
      msg: 'SUCCESS',
      total: totalMetrics,
      type: 'ortb'
    }
  }

  updateMetricsForPartners(metrics, oRTBType) {
    if (!oRTBType) {
      return Object.fromEntries(metrics.map(metric => {
        return [metric, 0];
      }))
    }

    const reformedMetrics = metrics.map(metric => {
      return mapping.get(metric) ? mapping.get(metric) : metric;
    })

    return Object.fromEntries(reformedMetrics.map(metric => {
      return [metric, 0];
    }))
  }
}

module.exports = OrtbAnalyticsReport;
