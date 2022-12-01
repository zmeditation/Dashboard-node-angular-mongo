const { dateFormat } = require('../../../../../tac/modules/reports/metrics/date/index');
const { roundValues } = require('../../../../../reporting/queryModule/queryRunner/runAggregationResultsHelpers/helpers');

class MetricsReformer {
    constructor(args, filters) {
        this.args = args;
        this.filters = filters;
    }

    editPeriodForReq() {
        return dateFormat(this.args);
    }

    roundInt(enumerate) {
        return this.args.map(el => {
            el.metrics = roundValues(el.metrics);
            el.enumerate = enumerate;
            return el;
        });
    }

    totalMetrics(total) {
        return roundValues(total);
    }
}

module.exports = MetricsReformer;
