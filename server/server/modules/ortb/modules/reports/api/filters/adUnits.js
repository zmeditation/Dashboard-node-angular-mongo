const units = require('./res/units.json');

class AdUnitsList {
    constructor() {
    }

    run() {
        return {
            success: true,
            name: 'AD_UNITS',
            results: units
        }
    }
}

module.exports = AdUnitsList;
