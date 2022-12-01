const fs = require('fs')

exports.getPubsRevenueByDateSum = async(rangeForReports, minSum = 30) => {
    try {
        const pathToFile = `${__dirname}/../../analytics/storage/publishersForLastThirtyDays.json`;
        const { reportRevenues, error: errorRev} = await readFile(pathToFile);
        if (errorRev !== null)  return { errorRev };

        const { pubsAndRevenues, errorIterator } = await reportIterator(reportRevenues, minSum);
        if (errorIterator !== null)  return { error: { errorIterator } }; 

        return {
            pubsAndRevenues,
            error: null
        }
    } catch (e) {
        console.log(`getPubsRevenueByDateSum ${e.path || e}`);
        
        return {
            pubsAndRevenues: null,
            error: { msg: 'Error to get sum of publishers revenue' }
         }
    }
}

const readFile = (pathToFile) => {

    return new Promise( (resolve, reject) => {
    //   fs.exists(pathToFile, exist => {

        if (!fs.existsSync(pathToFile)) {     
            reject({ error: { msg: 'Not found file.'}});

        } else if (fs.existsSync(pathToFile)) { 
            fs.readFile(pathToFile, 'utf8', (err, data) => {

                if (err) { reject({ error: { msg: 'Error read file.'}})};
                resolve({ 
                    reportRevenues: !!data ? JSON.parse(data) : { "results": "undefined" }, 
                    error: null
                });
            });
        } 
    // })
  })
};

// Sum of all revenue for any pubs
const reportIterator = async(reportRevenues, minSum) => {
    try {   
        const mapOfRevenues = new Map();

        await Promise.all(reportRevenues.analytics.map( obj => {
            obj.analytics.forEach( objRevenue => {
                
                if (mapOfRevenues.has(obj.name) === true) {
                    mapOfRevenues.set(obj.name, mapOfRevenues.get(obj.name) + +objRevenue.revenue);

                } else if (typeof obj.name === 'string') {
                    mapOfRevenues.set(obj.name, +objRevenue.revenue);
                }
            } )
        } ));

        mapOfRevenues.forEach((val, key, map) => {
            map.set(key, +val.toFixed(2))
            if (val < minSum) map.delete(key)
        });

        return {
            pubsAndRevenues: Object.fromEntries(mapOfRevenues),
            errorIterator: null
        }
    } catch (e) {
        console.log('getPubsRevenueByDateSum reportIterator Error');

        return {
                pubsAndRevenues: null,
                errorIterator: { msg: 'Error reportIterator' }
        }
    }
}
