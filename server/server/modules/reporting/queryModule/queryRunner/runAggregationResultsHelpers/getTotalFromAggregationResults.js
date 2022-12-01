const { roundValues } = require('./helpers');

exports.getTotalOfAggregationResults = (resultArray, metrics) => {
    metrics = metrics.map(metric => metric.toLowerCase());

    const total = resultArray.reduce((acc, result) => {

        const values = {
            requests:  result['metrics']['requests'] ? result['metrics']['requests'] : result['implicit']['requests'],
            impressions: result['metrics']['impressions'] ? result['metrics']['impressions'] : result['implicit']['impressions'],
            clicks: result['metrics']['clicks'] ? result['metrics']['clicks'] : result['implicit']['clicks'],
            revenue: result['metrics']['revenue'] ? result['metrics']['revenue'] : result['implicit']['revenue'],
            partnersfee: result['metrics']['partnersfee'],
            viewability: result.metrics.viewability
        };

        return {
            requests: acc['requests'] + values['requests'],
            impressions: acc['impressions'] + values['impressions'],
            clicks: acc['clicks'] + values['clicks'],
            revenue: acc['revenue'] + values['revenue'],
            partnersfee: acc['partnersfee'] + values['partnersfee'],
            viewability: acc.viewability + ((typeof values.viewability === 'number') 
                ? values.viewability : 0 )
        }
    }, {
        requests: 0,
        impressions: 0,
        clicks: 0,
        revenue: 0,
        partnersfee: 0,
        viewability: 0
    });
    // replace zeroes with 1 to be able to divide
    total['impressions'] = total['impressions'];
    total['requests'] = total['requests'];

    total['cpm'] = total['revenue'] / total['impressions'] * 1000;
    total['ctr'] = total['clicks'] * 100 / total['impressions'];
    total['fillrate'] = total['impressions'] / total['requests'] * 100;

    total.viewability = total.viewability.toFixed(2) / resultArray.length;

    let allowed = {};
    for (const metric of metrics) {
        allowed[metric] = total[metric];
    }

    return { date: 'Total', ...roundValues(allowed) };
};