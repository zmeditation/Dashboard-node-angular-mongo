const countries = require('../../../../../wbid/services/reports/getCountries/countries-full.json');
const User = require("../../../../../../../server/database/mongoDB/migrations/UserModel");
const sspList = require('../filters/res/ssp.json');
const { SSP } = require('../filters/res/pg/models');

class DimensionsSetter {

  constructor(data, dimensions) {
    this.currentData = data;
    this.dimensions = dimensions;
    if (this.currentData.length === 0) {
      this.currentData.push({
        groupMetricsData: [],
        metrics: {
          ssp_requests: 0,
          ssp_responses: 0,
          dsp_requests: 0,
          dsp_response: 0,
          impression: 0,
          view: 0,
          click: 0,
          revenue_imp: 0
        }
      });
      this.dimensions = [];
    }
  }

  reform() {
    return this.currentData.map(el => {
      el.dimensions = {};
      for (let i of this.dimensions) {
        const index = this.dimensions.indexOf(i);
        el.dimensions[i] = el.groupMetricsData[index];
        if (i === 'day' || i === 'month') {
          el.date = el.groupMetricsData[index].replace(/T.*/, '');
        }
        if (i === 'size') {
          if (el.groupMetricsData[index] === '') {
            el.dimensions[i] = 'other';
          } else {
            el.dimensions[i] = el.groupMetricsData[index].replace(/,/, 'x');
          }
        }
        if (i === 'is_hb') {
          el.dimensions[i] === '1'
            ? el.dimensions[i] = 'Header Bidding'
            : el.dimensions[i] = 'Open RTB'
        }
        if (i === 'country') {
          el.dimensions[i] = this.countriesChange(el.dimensions[i]);
        }
        if (i === 'device_type') {
          switch (el.dimensions[i]) {
            case '0':
              el.dimensions[i] = 'other';
              break;
            case '1':
              el.dimensions[i] = 'mobile/desktop';
              break;
            case '2':
              el.dimensions[i] = 'desktop';
              break;
            case '3':
              el.dimensions[i] = 'TV';
              break;
            case '4':
              el.dimensions[i] = 'mobile';
              break;
            case '5':
              el.dimensions[i] = 'tablet';
              break;
            case '6':
              el.dimensions[i] = 'connected device/IoT';
              break;
            case '7':
              el.dimensions[i] = 'set top box';
              break;
          }
        }
        if (i === 'os' && el.groupMetricsData[index] === '') {
          el.dimensions[i] = 'unknown';
        }
      }
      return el;
    });
  }

  async reformSspId(dataWithDimensions, dimension) {
    switch (dimension) {
      case 'ssp_pub_id': {
        for (let data of dataWithDimensions) {
          if (data.dimensions[dimension] && data.dimensions[dimension].length === 24) { //for mongodb IDs
            const user = await User.findById(data.dimensions[dimension]);
            if (user) {
              data.dimensions[dimension] = user['name'].toLowerCase();
            } else if (sspList[data.dimensions[dimension]] !== undefined) { // try to find ID in local stored SSP list
              data.dimensions[dimension] = sspList[data.dimensions[dimension]].toLowerCase();
            }
          } else if (data.dimensions[dimension] && data.dimensions[dimension].length === 2) { // for postgres ids
            const user = await SSP.findOne({ where: { id: data.dimensions[dimension] } });
            if (user) {
              data.dimensions[dimension] = user['dataValues'].name;
            }
          }
        }
        return dataWithDimensions;
      }
      case 'pub_id': {
        for (const data of dataWithDimensions) {
          if (data.dimensions[dimension] === '') {
            data.dimensions[dimension] = 'undefined';
          } else {
            const user = await SSP.findOne({ where: { id: data.dimensions[dimension] } });
            if (user) {
              data.dimensions[dimension] = user['dataValues'].name;
            } else if (data.dimensions[dimension] === '0') {
              data.dimensions[dimension] = 'other';
            }
          }
        }
        return dataWithDimensions;
      }
    }

  }

  countriesChange(label) {
    countries.forEach(country => {
      if (label === country.code) {
        label = country.name;
      } else if (label === country['alpha-3']) {
        label = country.name;
      }
    });
    if (label === '-') {
      label = 'Other'
    }
    return label;
  }
}

module.exports = DimensionsSetter;
