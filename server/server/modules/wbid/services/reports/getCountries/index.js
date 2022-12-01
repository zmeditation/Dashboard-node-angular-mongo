const countries = require('./countries-full.json');

class CountriesList {
  constructor(){ }

  run() {
    return {
      success: true,
      name: 'COUNTRIES',
      results: countries,
    }
  }
}

module.exports = CountriesList;
