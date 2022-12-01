//const mongoose = require("mongoose");
const User = require('../../../../../database/mongoDB/migrations/UserModel');
const countries = require('../../../../wbid/services/reports/getCountries/countries.json');

class DimensionsSetter {

    constructor(data, dimensions) {
        this.currentData = data;
        this.dimensions = dimensions;
        if (this.currentData.length === 0) {
            this.currentData.push({
                groupMetricsData: [],
                metrics: {
                    requests: 0,
                    impressions: 0,
                    view: 0,
                    clicks: 0,
                    no_ad: 0
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
                if (i === 'sizes') {
                    el.dimensions[i] = el.groupMetricsData[index].replace(/\,/, 'x');
                }
                if (i === 'country') {
                    el.dimensions[i] = this.countriesChange(el.dimensions[i]);
                }
                if (i === 'ad_type' && el.groupMetricsData[index] === '') {
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
        countries.forEach(country => {
            if (label === country.code) {
                label = country.name;
            }
        });
        return label;
    }

    async pub_id(data) {
        const queryArray = data.map(el => el.dimensions['pub_id']).filter(el => el !== '');
        const users = await Users.find({'_id': {$in: queryArray}});
        data.forEach(el => {
            if (users.length === 0) {
                el.dimensions['pub_id'] = 'undefined';
            }
            users.forEach(user => {
                if (el.dimensions['pub_id'] === user._id.toString()) {
                    el.dimensions['pub_id'] = user.name;
                }
            })
        })
        return data;
    }

    async manager_id(data) {
        const queryArray = data.map(el => {
            return el.dimensions['manager_id'];
        }).filter(manager => manager !== 'No Manager' && manager !== 'UNKNOWN_ID');

        await User.find({'_id': {$in: queryArray}})
            .then(users => {
                if (users.length > 0) {
                    users.forEach(user => {
                        data.forEach(el => {
                            if (el.dimensions['manager_id'] === user._id.toString()) {
                                el.dimensions['manager_id'] = user.name;
                            }
                        })
                    })
                }
            })
        return data;
    }

}

module.exports = DimensionsSetter;
