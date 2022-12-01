const currencies = require('./res/currencies.json');

class CurrenciesList {
    constructor() {
    }

    run() {
        return {
            success: true,
            name: 'CURRENCIES',
            results: Object.keys(currencies)
        }
    }
}

module.exports = CurrenciesList;
