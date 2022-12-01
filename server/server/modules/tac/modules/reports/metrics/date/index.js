const moment = require('moment');

exports.dateFormat = (period) => {
  try {
    const result = {
      dateFrom: '',
      dateTo: ''
    };
    switch(period) {
      case 'today':
        result.dateTo = moment.utc().format('YYYY-MM-DD');
        result.dateFrom = moment.utc().format('YYYY-MM-DD');
        break;
      case 'yesterday':
        result.dateTo = moment.utc().subtract(1, 'days').format('YYYY-MM-DD');
        result.dateFrom = result.dateTo;
        break;
      case 'lastThreeDays':
        result.dateFrom = moment.utc().subtract(3, 'days').format('YYYY-MM-DD');
        result.dateTo = moment.utc().subtract(1, 'days').format('YYYY-MM-DD');
        break;
      case 'lastSevenDays':
        result.dateFrom = moment.utc().subtract(7, 'days').format('YYYY-MM-DD');
        result.dateTo = moment.utc().subtract(1, 'days').format('YYYY-MM-DD');
        break;
      case 'monthToYesterday':
        result.dateFrom = moment.utc().date(1).format('YYYY-MM-DD');
        result.dateTo = moment.utc().subtract(1, 'days').format('YYYY-MM-DD');
        break;
      case 'lastSixtyDays':
        result.dateFrom = moment.utc().subtract(60, 'days').format('YYYY-MM-DD');
        result.dateTo = moment.utc().subtract(1, 'days').format('YYYY-MM-DD');
        break;
      case 'lastMonth':
        result.dateFrom = moment.utc().subtract(1, 'months').date(1).format('YYYY-MM-DD');
        result.dateTo = moment.utc().date(1).subtract(1, 'days').format('YYYY-MM-DD');
        break;
    }
    return result;
  } catch(err) {
    throw err;
  }

}
