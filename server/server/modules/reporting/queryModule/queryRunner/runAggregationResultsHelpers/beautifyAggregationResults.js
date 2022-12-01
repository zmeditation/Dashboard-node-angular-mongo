const { string } = require('../../../../utilities/string');
const moment = require('moment');
const { roundValues } = require('./helpers');

exports.beautifyAggregationResults = (objects, publishers, managers) => {
    let result = [];

    // modifying the result array;
    
    for (const value of Object.keys(objects)) {

        const [ obj ] = objects[value];

        const { date, interval } = obj;
        const allowedDimensions = ['publisher', 'property', 'placement', 'domain', 'origin', 'inventorytype', 'size', 'manager'];
        const allowedMetrics = ['requests', 'impressions', 'fillRate', 'clicks', 'ctr',  'cpm', 'revenue', 'partnersFee', 'viewability'];
        const allowedImplicitMetrics = ['implicitRevenue', 'implicitImpressions', 'implicitClicks', 'implicitRequests'];

        const tempObject = {
            date,
            interval,
            dimensions: {},
            metrics: {},
            implicit: {}
        };
        
        allowedDimensions.forEach(dimension => {
            if (obj['_id'][dimension]) {
                tempObject['dimensions'][dimension.toLowerCase()] = obj['_id'][dimension];
            }
        });

        allowedMetrics.forEach(metric => {
            if (obj[metric] || obj[metric] === 0) {
                tempObject['metrics'][metric.toLowerCase()] = obj[metric];
            }
        });

        allowedImplicitMetrics.forEach(metric => {
            const implicitMetricValue = obj[metric] ? obj[metric] : 0;
            tempObject['implicit'][metric.replace('implicit', '').toLowerCase()] = implicitMetricValue;
        });

        // get unix date
        // tempObject['date'] = moment(obj['date']).utcOffset(0).unix() * 1000;
        tempObject['date'] = getDateByIntervalType(date, interval);

        if (tempObject['dimensions']['publisher']) {

            const { name } = publishers.find(publisher => {
                return publisher['_id'].toString() === tempObject['dimensions']['publisher'].toString();
            });
            if (name) {
                tempObject['dimensions']['publisher'] = string.capitalizeString(name);
            }

        }
        if (tempObject['dimensions']['manager']) {

            managers = managers.filter( el => el !== null);
            const { name } = managers.find(manager => {
                return manager['_id'].toString() === tempObject['dimensions']['manager'].toString();
            });
            if (name) {
                tempObject['dimensions']['manager'] = string.capitalizeString(name);
            }
        }
        tempObject['metrics'] = roundValues(tempObject['metrics']);

        result = [...result, tempObject]
    }

    return result;
};

function getDateByIntervalType(date, interval) {
    const intervalTypes = {
        monthly: moment(date).format('YYYY-MM'),
        daily: moment(date).format('YYYY-MM-DD'),
        total: 'total'
    };

    return intervalTypes[interval];
}