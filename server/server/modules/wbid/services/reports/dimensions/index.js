const mongoose = require("mongoose");
const Users = mongoose.model("User");
const CountriesISO = require('../getCountries/countries.json');

class DimensionSetter {

  constructor(data, dimensions) {
    this.currentData = data;
    this.dimensions = dimensions;
    if (this.currentData.length === 0) {
      this.currentData.push({
        groupMetricsData: [],
        metrics: {
          impressions: '0',
          requests: '0',
          fill_rate: 0,
          revenue: 0,
          cpm: 0
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
        if (i === 'ad_unit_size') {
          el.dimensions[i] = el.groupMetricsData[index].replace(/\,/, 'x');
        }
        if (i === 'country') {
          el.dimensions[i] = this.countriesChange(el.dimensions[i]);
        }
        if (i === 'ad_unit_type' && el.groupMetricsData[index] === '') {
          el.dimensions[i] = 'other';
        }
        if (i === 'device' && el.groupMetricsData[index] === '') {
          el.dimensions[i] = 'other';
        }
        if (
            (i === 'manager_id' && el.groupMetricsData[index] === '') ||
            (i === 'manager_id' && el.groupMetricsData[index].search(/^ll\}/) !== -1) ||
            (i === 'manager_id' && el.groupMetricsData[index].search(/\,/) !== -1)
        ) {
          el.dimensions[i] = 'No Manager';
          if (el.groupMetricsData[index].search(/^ll\}/) !== -1 || el.groupMetricsData[index].search(/\,/) !== -1) {
            el.dimensions[i] = 'UNKNOWN_ID';
          }
        }
        if (i === 'browser' && el.groupMetricsData[index] === 'unknown other') {
          el.dimensions[i] = 'unknown';
        }
        if (i === 'os' && el.groupMetricsData[index] === 'unknown other') {
          el.dimensions[i] = 'unknown';
        }
      }
      return el;
    });
  }

  countriesChange(label) {
    CountriesISO.forEach( el => {
      if (label === el.code) {
        label = el.name;
      }
    });
    return label;
  }

  async publisher_id(data) {
    const arrayProblemIds = [
      [
        '5cf4e6eb3ae2d32cbc056d87',
        '5d679e4265fa08156ce1941e',
        '5e2acfc79332201a06822a59'
      ],
      [
        '5cf4e5103ae2d32cbc056d80',
        '5c9dd8a2da88131a9d54f861',
        '5e218bbfc0712e2a313d122a'
      ],
    ]
    const queryArray = data.map(el => {
      if (arrayProblemIds[0].includes(el.dimensions['publisher_id'])) {
        el.dimensions['publisher_id'] = arrayProblemIds[1][arrayProblemIds[0].indexOf(el.dimensions['publisher_id'])];
      }
      return el.dimensions['publisher_id'];
    }).filter(el => el !== '');
    await Users.find({ '_id': { $in: queryArray } })
      .then(users => {
        data.forEach(el => {
          if (users.length === 0) {
            el.dimensions['publisher_id'] = 'undefined';
          };
          users.forEach(usr => {
            if (el.dimensions['publisher_id'] === usr._id.toString()) {
              el.dimensions['publisher_id'] = usr.name;
            }
          })
        })
        data.forEach(e => {
          if (e.dimensions['publisher_id'].match(/^[a-fA-F0-9]{24}$/)) {
             e.dimensions['publisher_id'] = 'PUBLISHER_NOT_DEFINED';
          }
        });
      })
    return data;
  }

  async manager_id(data) {
    const queryArray = data.map(el => {
      return el.dimensions['manager_id'];
    }).filter(manager => manager !== 'No Manager' && manager !== 'UNKNOWN_ID');

    await Users.find({ '_id': { $in: queryArray } })
      .then(users => {
        if (users.length > 0) {
          users.forEach(usr => {

            data.forEach(el => {
              if (el.dimensions['manager_id'] === usr._id.toString()) {
                el.dimensions['manager_id'] = usr.name;
              }
            })
          })
        }
      })
    return data;
  }

}

module.exports = DimensionSetter;
