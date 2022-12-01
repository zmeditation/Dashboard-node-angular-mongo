const moment = require('moment');

exports.combineAggregationResults = (aggregationResults, { interval, metrics, fillMissing, placeholderArray }, commissionResults) => {

    // If there are several types of commission, the aggregationResults Array will have several arrays of objects.
    // First we concat these arrays by a reduce function and give every object a unique ID plus we create a set of these unique IDs

    const { set, reducedResults } = reduceResultsAngGetSetWithUniqueIds(aggregationResults, commissionResults);

    // Creating an object with every unique ID in it as a key. If there are objects with the same ID, they are pushed into an array that has this ID

    const reducedById = getObjectWithUniqueIds(reducedResults);

    // Creating placeholder IDs with every possible id combination that one can get from the query parameters

    const placeholdersIds = createPlaceholderIds(placeholderArray, set);

    // Figuring out every missing ID and inserting placeholders instead of them

    return fillMissing ? fillMissingResults(placeholdersIds, reducedById, interval, metrics) : reducedById;

};

const actions = {
    impressions: (a, b) => a['impressions'] + b['impressions'],
    implicitImpressions: (a, b) => a['implicitImpressions'] + b['implicitImpressions'],
    revenue: (a, b) => a['revenue'] + b['revenue'],
    partnersFee: (a, b) => a['partnersFee'] + b['partnersFee'],
    implicitRevenue: (a, b) => a['implicitRevenue'] + b['implicitRevenue'],
    clicks: (a, b) => a['clicks'] + b['clicks'],
    implicitClicks: (a, b) => a['implicitClicks'] + b['implicitClicks'],
    requests: (a, b) => a['requests'] + b['requests'],
    implicitRequests: (a, b) => a['implicitRequests'] + b['implicitRequests'],
    ctr: (a) => {
        if ((!a['clicks'] && a['clicks'] !== 0) || (!a['impressions'] && a['impressions'] !== 0)) {
            return a['implicitClicks'] * 100 / a['implicitImpressions'];
        }

        const clicks = a['clicks'];
        const imp = a['impressions'] || 1;

        return clicks * 100 / imp;
    },
    cpm: (a) => {
        if ((!a['impressions'] && a['impressions'] !== 0) || (!a['revenue'] && a['revenue'] !== 0)) {
            return a['implicitRevenue'] / a['implicitImpressions'] * 1000;
        }

        const revenue = a['revenue'];
        const impressions = a['impressions'] || 1;

        return revenue / impressions * 1000;
    },
    fillRate: (a) => {
        if ((!a['impressions'] && a['impressions'] !== 0) || (!a['requests'] && a['requests'] !== 0)) {
            return a['implicitImpressions'] / a['implicitRequests'] * 100;
        }

        const request = a['requests'] || 1;
        const impressions = a['impressions'];

        return impressions / request * 100;
    }
};

function reduceResultsAngGetSetWithUniqueIds(aggregationResults, commissionResults) {
    const set = new Set([]);
    let fullСommission;
    for (let obj of commissionResults) {
        fullСommission = commissionResults[0].concat(obj);
    }    
        const reducedResults = aggregationResults.reduce((acc, res) => {
            const mappedRes = res.map(r => {
                const excluded = ['interval', 'month', 'year'];
                const filteredKeys = Object.keys(r['_id']).filter(key => !excluded.includes(key));
    
                const date = getDateByIntervalType(r['date'], r['interval']);
    
                let filteredValues = {};
    
                for (const key of filteredKeys) {
                    filteredValues[key] = r['_id'][key];
                }
    
                const valuesWithDate = { interval: date, ...filteredValues };
         
                set.add(JSON.stringify(filteredValues));
                r['id'] = JSON.stringify(valuesWithDate);

                if (fullСommission !== undefined) {
                    r.partnersFee = 0;
                };
                return r;
            });
    
            return [...acc, ...mappedRes];
        }, []);
    
        if (fullСommission !== undefined) {
            fullСommission.forEach( item => {
                reducedResults.forEach(el => {
        
                    // console.log('comm -', item._id, 'reps -', el._id, el.date.getMonth());
                    if (el._id.domain === item._id.domain) {
                        if (el._id.interval !== 'total' && item.date.toString() === el.date.toString()) {
                            el.partnersFee = item.partnersFee;
                        } else if (el._id.interval === 'total' || el._id.interval === el.date.getMonth() + 1 && el.interval === 'monthly') {
                            el.partnersFee = item.partnersFee;
                        } 
                    }
                })
            })
        }
    return { set, reducedResults };
}

function getObjectWithUniqueIds(reducedResults) {
    return reducedResults.reduce((acc, res) => {
        acc[res.id] = acc[res.id] ? acc[res.id] : [];

        let reduced = [...acc[res.id], res];

        reduced = reduced.reduce((ac, r) => {
           // reduced = 1 or less than 1, return the second value instead of the acc
            if (Array.isArray(ac) && ac.length === 0) {
                const current = JSON.parse(JSON.stringify(r));
                secondToReduce(r, current, actions);
                return [ current ]
            } else {
                // if (reduced.length > 1 continue combining the objects in the array
                const current = Array.isArray(ac) ? ac[0] : ac;
                firstToReduce(r, current, actions);
                secondToReduce(r, current, actions);
                return [ current ];
            }
        }, []);

        reduced = !Array.isArray(reduced) ? [ reduced ] : reduced;

        acc[res.id] = reduced;

        return acc;
    }, {});
}

function fillMissingResults(placeholders, reducedByIdObject, interval, metrics) {

    const missingResults = placeholders.filter(value => {
        return !Object.keys(reducedByIdObject).includes(value)
    });

    for (const result of missingResults) {
        const id = JSON.parse(result);
        const metricsObject = {};

        for (const metric of metrics) {
            metricsObject[metric] = 0;
        }

        reducedByIdObject[result] = [
            {
                _id: id,
                date: moment(id.interval),
                interval: interval,
                ...metricsObject
            }
        ]
    }

    return reducedByIdObject;
}

function createPlaceholderIds(plArr, set) {
    const valuesArr = [];

    if (set.size) {
        for (const placeholder of plArr) {
            set.forEach(key => {
                const tempObj = JSON.parse(key);
                valuesArr.push(JSON.stringify({ interval: placeholder, ...tempObj }))
            })
        }
    }

    return valuesArr;
}

function getDateByIntervalType(date, interval) {
    const intervalTypes = {
        monthly: moment(date).format('YYYY-MM'),
        daily: moment(date).format('YYYY-MM-DD'),
        total: 'total'
    };

    return intervalTypes[interval];
}

function firstToReduce(objectToReduce, currentAcc, reduceMethods) {
    const firstToReduceList = ['impressions', 'clicks', 'revenue', 'partnersFee', 'requests', 'implicitImpressions', 'implicitClicks', 'implicitRevenue', 'implicitRequests'];

    for (const key of Object.keys(objectToReduce)) {
        if(firstToReduceList.includes(key)) {
            currentAcc[key] = currentAcc[key] || currentAcc[key] === 0 ? reduceMethods[key](currentAcc, objectToReduce) : objectToReduce[key];
        } else {
            currentAcc[key] = objectToReduce[key];
        }
    }
}

function secondToReduce(objectToReduce, currentAcc, reduceMethods) {
    const secondToReduceList = ['ctr', 'cpm', 'fillRate'];

    for (const key of Object.keys(objectToReduce)) {
        if (secondToReduceList.includes(key)) {
            currentAcc[key] = currentAcc[key] || currentAcc[key] === 0 ? reduceMethods[key](currentAcc, objectToReduce) : objectToReduce[key];
        }
    }
}