const { findDeductions, generateDateQuery, compareByDate, getSumOfDeductions } = require('../deductionsHelper/helper');

const deductionOfPub = async (query) => {
  try {
    const { publishers, date, sum = false, sumAll = false } = query;
    const isValidDate = typeof date === 'object';

    const isSearchByPub = Array.isArray(publishers) && publishers.every(el => typeof el === 'string');

    let { publishersAndDeductions, error } = await findDeductions('ALL');
    if (error !== null) {
      return { error: { error } };
    }

    if (isSearchByPub === true) {
      publishersAndDeductions = publishersAndDeductions.filter((obj) => publishers.includes(obj.refs_to_user.name));
    }

    if (isValidDate === true) {
      const { range, dateFrom, dateTo } = date;
      const { formDate, toDate, error } = await generateDateQuery(range, dateFrom, dateTo);
      if (error !== null) {
        throw error;
      }

      publishersAndDeductions = await compareByDate(publishersAndDeductions, formDate, toDate);
    }

    if (sum === true || sumAll === true) {
      const { sumOfDeductions } = getSumOfDeductions(sum, sumAll, publishersAndDeductions);
      publishersAndDeductions = sumOfDeductions;
    }

    return { publisherDeductions: publishersAndDeductions, error: null };
  } catch (error) {
    console.dir(error && error.msg ? error.msg : error.message);
    return { error: { msg: error && error.msg ? error.msg : 'GET PUBLISHER DEDUCTIONS ERROR' } };
  }
};

module.exports = {
  deductionOfPub
};