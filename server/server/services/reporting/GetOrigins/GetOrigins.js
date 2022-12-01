const { PROGRAMMATICS } = require('../../../constants/origins');
const { REPORT_FILTERS } = require('../../../constants/reportFilters');

class GetValues {
    constructor(query) {
        this.queryCode = query;
    }

    async execute(query) {
        const q = query ? query : this.queryCode;
        switch(q) {
            case REPORT_FILTERS.ORIGIN:
                return {
                  success: true,
                  origins: PROGRAMMATICS
                };
                break;
            default:
                return {
                    success: false,
                    message: 'no data'
                }
        }

    }
}

module.exports = GetValues;
