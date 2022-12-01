import grpcService from '../../../../services/grpc/index';
const PROTO_PATH = `${__dirname}/grpc/protos/tac_table.proto`;
const DimensionsSetter = require('./dimensions/index');
const MetricsReformer = require('./metrics/index');
const FilterReformer = require('./filters/index');
const PermissionCheck = require('./permissionsCheck/index');
const serviceObject = {type: 'tac', service: 'analytics'};

const endpoint = process.env.TAC_ENDPOINT;

class TacAnalyticsReport extends PermissionCheck {
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
                filterResult: [{
                    dimensions: {},
                    enumerate: true,
                    groupMetricsData: [],
                    metrics: {
                        requests: 0,
                        impressions: 0,
                        view: 0,
                        clicks: 0,
                        no_ad: 0
                    }
                }],
                dimensions: [],
                filters: [],
                msg: 'ERROR',
                total: {
                    requests: 0,
                    impressions: 0,
                    view: 0,
                    clicks: 0,
                    no_ad: 0
                }
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
        const changeDimensionValuesPublishers = response.metrics.includes('pub_id')
            ? await ReformDimensions.pub_id(dataWithDimensions)
            : dataWithDimensions;
        const changeDimensionValuesMangers = response.metrics.includes('manager_id')
            ? await ReformDimensions.manager_id(changeDimensionValuesPublishers)
            : changeDimensionValuesPublishers;
        const _metrics = new MetricsReformer(changeDimensionValuesMangers, filters);
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
            total: totalMetrics
        }
    }
}

module.exports = TacAnalyticsReport;
