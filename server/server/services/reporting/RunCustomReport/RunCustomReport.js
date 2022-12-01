const { canReadAllReports, canReadAllPubsReports, canReadOwnPubsReports, canReadOwnReports} = require("./runCustomReportSmaller");

const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');

class RunCustomReport extends Base {
    constructor(args) {
        super(args);
    }

    /**
     * @typedef queryObject 
     * @type {Object}
     * @property {string[]} queryObject.metrics
     * @property {string[]} queryObject.dimensions
     * @property {[{filterId: string, name: string, values: [string|number], type: string}]} queryObject.filters
     * @property {string} queryObject.range
     * @property {string} queryObject.interval
     * @property {boolean} queryObject.enumerate
     * @property {boolean} queryObject.fillMissing
     * @property {boolean} queryObject.fillMissing
     * @property {{dateFrom: string, dateTo: string}} queryObject.customRange
     */

    /**
     *  @param {queryObject} queryObject - report query
     *  @returns {queryObject} the same query, just filtered
    */
    checkForMailRuGroup(queryObject) {     // это ужасный костыль, никогда так не делайте
        const MailRuId = '5c6d1f1396bf191a6037f13c';
        const filters = queryObject?.filters;
        if (filters.length) {
            for (const filter of filters) {
                if (filter.name === 'PUBLISHERS' && filter.type === 'include' && filter.values.includes(MailRuId)) {
                    console.log('mail.ru detected, disable requests and fillrate')
                    queryObject.metrics = queryObject.metrics.filter(value => value !== 'requests' && value !== 'fillRate');
                }
            }
        }
        return queryObject;
    }

    async execute({
        body: {
            request: queryObject,
            additional: {
                permission,
                id: userTokenId
            }
        },
        params
    }) {
        if (permission) {
            let reports;
            const query = this.checkForMailRuGroup(queryObject)
            switch (permission) {
                case "canReadAllReports":
                    reports = await canReadAllReports(query, userTokenId);
                    break;
                case "canReadAllPubsReports":
                    reports = await canReadAllPubsReports(query, userTokenId);
                    break;
                case "canReadOwnPubsReports":
                    reports = await canReadOwnPubsReports(query, userTokenId);
                    break;
                case "canReadOwnReports":
                    reports = await canReadOwnReports(query, userTokenId);
                    break;
                default:
                    throw new ServerError('FORBIDDEN', 'FORBIDDEN');
            }

            if (!reports) {
                throw new ServerError('REPORT_RETRIEVAL_ERROR', 'BAD_REQUEST')
            }

            return query.type !== 'analytics-api' ? {
                success: true,
                filterResult: reports['results'] || [],
                total: reports['total'] || [],
                download: reports['download'] || null,
                msg: 'SUCCESS'
            } : reports['results'] || [];
        } else {
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }
    }
}

module.exports = RunCustomReport;
