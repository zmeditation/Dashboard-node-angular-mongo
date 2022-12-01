const { createMatchObject } = require('./generateAggregationHelpers/createMatchObjectFunction');
const { createDimensionsObject } = require('./generateAggregationHelpers/createDimensionsObjectFunction');
const { createMetricsObject } = require('./generateAggregationHelpers/createMetricsObjectFunction');
const moment = require('moment');

exports.generateAggregationObject = (queryObject, gfc, commissionType) => {
  const {
    $match: {
      day: { $gte: dateFrom, $lte: dateTo }
    }
  } = createMatchObject(queryObject);
  const interval = queryObject.interval;
  const dummyArray = getDates(dateFrom, dateTo, interval);

  return {
    dummyArray,
    query: [
      createMatchObject(queryObject),
      createSortObject(queryObject),
      {
        $group: {
          _id: createDimensionsObject(queryObject),
          date: { $first: '$day' },
          interval: { $first: queryObject.interval },
          ...createMetricsObject(queryObject, gfc, commissionType)
        }
      },
      { $sort: { date: 1 } }
    ]
  };
};

function createSortObject(query) {
  return { $sort: { day: 1 } };
}

function getDates(startDate, endDate, interval) {
  if (interval === 'total') {
    return [];
  }
  const dateArray = [];
  let currentDate = moment(startDate);
  const stopDate = moment(endDate).set({ hours: 0, minutes: 0, seconds: 0 });

  if (interval === 'daily') {
    while (currentDate < stopDate) {
      dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
      currentDate = moment(currentDate).add(1, 'days');
    }
  } else if (interval === 'monthly') {
    while (currentDate < stopDate) {
      dateArray.push(currentDate.format('YYYY-MM'));
      currentDate.add(1, 'month');
    }
  }

  // console.log(dateArray);
  return dateArray;
}
