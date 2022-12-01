const Deduction = require('../../../database/mongoDB/migrations/DeductionModel');
const moment = require('moment');
const flow = require('lodash/fp/flow');
const sumBy = require('lodash/fp/sumBy');

const _calculateTotalDeductions = (deductions) => {
  const groupedTotalDeductions = deductions.reduce((acc, { date, deduction }) => {
    const stringDate = date.toISOString();

    acc[stringDate] ||= 0;
    acc[stringDate] = acc[stringDate] + deduction;

    return acc;
  }, {});

  return Object.entries(groupedTotalDeductions).map(
    ([date, deduction]) => ({ date, deduction })
  );
};

const _monthDate = date => new Date(date).toISOString().slice(0, 7);

const _indexOfDeduction = (deductions, type, date) => {
  const targetDate = _monthDate(date);

  return deductions.findIndex((deduction) =>
    type === deduction.type && _monthDate(deduction.date) === targetDate
  );
};

const _filterDeductionsByDate = (deductions, date) => {
  const targetDate = _monthDate(date);
  return deductions.filter((deduction) => _monthDate(deduction.date) === targetDate);
};

const getTotalDeductionByDate = (deductions, date) => flow(
  deductions => _filterDeductionsByDate(deductions, date),
  sumBy('deduction')
)(deductions);

const upsertDeduction = (deductions, type, date, sumOfDeduction) => {
  try {
    const { errorSymbols } = allowedSymbols(sumOfDeduction);

    if (errorSymbols !== null) {
      return { errorChangeDed: errorSymbols };
    }

    let newDeductions = [...deductions];
    let successMsg = '';

    const deductionIndex = _indexOfDeduction(newDeductions, type, date);

    if (~deductionIndex) {
      newDeductions[deductionIndex].deduction = sumOfDeduction;
      successMsg = 'THE_DEDUCTION_WAS_EDITED';
    } else {
      newDeductions = concatDeductions(newDeductions, type, date, sumOfDeduction);
      successMsg = 'THE_DEDUCTION_WAS_ADDED';
    }

    return {
      newDeductions,
      successMsg,
      errorChangeDed: null
    };

  } catch (error) {
    console.log(error);
    return { errorChangeDed: { msg: 'Error during deductions change' } };
  }
};

const checkExpiredDeduction = async () => {
  try {
    const periodOfYear = 3;

    let minAllowedDate = new Date();
    minAllowedDate.setFullYear(minAllowedDate.getFullYear() - periodOfYear);
    const date = minAllowedDate.toISOString().split('T')[0];

    Deduction.updateMany({}, { $pull: { 'deductions': { 'date': { $lte: date } } } })
      .then(deduction => console.log(`Was done deleting expired deductions over 3 years old.`));

  } catch (error) {
    console.log(error);
  }
};

const generateDateQuery = async (range, dateFrom, dateTo) => {
  try {
    dateFrom = new Date(dateFrom);
    dateTo = new Date(dateTo);

    let isCustom = range === 'custom' || (!isNaN(dateFrom) && !isNaN(dateTo));

    if (range === 'custom' && (!dateFrom || !dateTo)) {
      return { error: { msg: 'Absent dateFrom or dateTo in custom query' } };
    }

    if (isCustom && (!dateFrom || !dateTo)) {
      return { error: { msg: `Not valid ${!dateFrom && 'dateFrom'} ${!dateTo && 'dateTo'}` } };
    }

    if (dateFrom > dateTo) {
      return { error: { msg: 'From date less then to date.' } };

    }
    const predefinedRanges = {
      lastSixtyDays: {
        from: moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).subtract(60, 'days').toDate(),
        to: moment().utcOffset(0).set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).subtract(1, 'days').toDate()
      },

      lastMonth: {
        from: moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).subtract(1, 'months').startOf('month').toDate(),
        to: moment().utcOffset(0).subtract(1, 'months').endOf('month').toDate()
      }
    };

    const customRange = {
      from: moment(dateFrom).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add(2, 'hours').toDate(),
      to: moment(dateTo).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).add(2, 'hours').toDate()
    };

    const { from, to } = isCustom ? { ...customRange } : { ...predefinedRanges[range] };
    const formDate = new Date(`${from}`).getTime();
    const toDate = new Date(`${to}`).getTime();

    return { formDate, toDate, error: null };

  } catch (error) {
    console.dir(error && error.msg ? error.msg : error.mesage);
    return { error: { msg: 'Date range error' } };
  }
};

const compareByDate = async (publishers, formDate, toDate) => {
  try {
    const comparedPub = [];

    publishers.forEach((obj) => {
      obj.deductions = obj.deductions.filter((obj) => {
        const deductionTime = new Date(obj.date).getTime();
        return deductionTime >= formDate && toDate >= deductionTime;
      });

      if (obj.deductions.length > 0) {
        comparedPub.push(obj);
      }
    });

    return comparedPub;
  } catch (error) {
    console.log(error && error.mesage);
    return [];
  }
};

const allowedSymbols = (string) => {
  const errorSymbols = { msg: 'Not allowed symbols for deduction.' };

  if (string === undefined || string === null || string === NaN || typeof string === 'object') {
    return { errorSymbols };
  }

  const symbols = string.toString().split('');
  const anotherSymbols = symbols.every(el => el.match(/[0-9]|[.-]/));

  if (anotherSymbols === false) {
    return { errorSymbols };
  }

  return { errorSymbols: null };
};

const findDeductions = async (usersId, managersId = [], showDetailedDeductions) => {
  try {
    if (!Array.isArray(usersId) && typeof usersId !== 'object' && typeof usersId !== 'string') {
      throw new Error('Passed parameter not correct. UserId must be either (Mongoose Id) string or array of them');
    }

    const findByIds = usersId === 'ALL' ? {} : { refs_to_user: usersId };

    const { newArray: publishersAndDeductions, error } = await Deduction.find(findByIds, 'deductions refs_to_user')
      .populate('refs_to_user', ['name', 'enabled', 'am'])
      .lean()
      .then((array) => {
        let error = null;
        let newArray = [];

        if (!array || (Array.isArray(array) && !array.length)) {
          return { error };
        }

        array.forEach((obj) => {
          if (obj.refs_to_user) {
            obj.refs_to_user.enabled.status === true && newArray.push(obj);
          } else {
            delDeductionById(obj._id);
          }
        });

        if (managersId?.length > 0) {
          newArray = newArray.filter(objPub => managersId.includes(objPub.refs_to_user.am + ''));
        }

        return {
          newArray,
          error: null
        };
      });

    if (showDetailedDeductions) {
      return { publishersAndDeductions, error };
    }

    const publishersAndTotalDeductions = publishersAndDeductions.map(
      ({ deductions, ...deduction }) => ({
        ...deduction,
        deductions: _calculateTotalDeductions(deductions)
      })
    );

    return {
      publishersAndDeductions: publishersAndTotalDeductions,
      error
    };
  } catch (error) {
    console.error(error);
    console.log('catch fired');
    return { error: { msg: 'Some error occured during deductions fetch' } };
  }
};

const concatDeductions = (deductions, type, date, sumOfDeduction) => {
  try {
    const newDeductions = [...deductions];

    newDeductions.push({
      type,
      date,
      deduction: sumOfDeduction
    });

    return newDeductions.sort((a, b) => {
      return b.date - a.date;
    });
  } catch (error) {
    console.dir(error && error.mesage);
  }
};


const createDeductionSchema = async (publisherId, type, date = new Date(2017, 0, 0, 2), sumOfDeduction = 0) => {
  try {
    const { errorSymbols } = allowedSymbols(sumOfDeduction);

    if (errorSymbols !== null) {
      return { errorCrDedSchema: errorSymbols };
    }

    const newDeduction = new Deduction({
      refs_to_user: publisherId,

      deductions: {
        date,
        type,
        deduction: sumOfDeduction
      }
    });

    await newDeduction.save(err => {
      if (err) {
        throw err;
      }
    });

    return {
      successMsg: 'CREATED_NEW_DEDUCTIONS_TABLE',
      errorCrDedSchema: null
    };

  } catch (error) {
    console.dir(error && error.msg ? error.msg : error.mesage);
    return { errorCrDedSchema: { msg: 'Create new Deduction chema error.' } };
  }
};


const delDeductionById = async (deductionId) => {

  Deduction.deleteOne({ _id: deductionId }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Deleted ${result} deduction object`);
    }
  });
};

const getSumOfDeductions = (sum, sumAll, pubAndDeduction) => {
  console.log({sum, sumAll, pubAndDeduction})
  try {
    const sumOfDeductions = [];

    if (sum === true) {
      pubAndDeduction.forEach(obj => {
        let total = 0;

        obj.deductions.length > 0 && obj.deductions.forEach(dedObj => {
          total += dedObj.deduction;
        });

        const date = obj.deductions.length > 0 ? {
          fromDate: obj.deductions[obj.deductions.length - 1].date,
          toDate: obj.deductions[0].date
        } : {};

        sumOfDeductions.push({ name: obj.refs_to_user.name, sumOfDeduction: total, date });
      });

      sumOfDeductions.sort((a, b) => {
        return a.sumOfDeduction - b.sumOfDeduction;
      });
      console.error({ sumOfDeductions })
      return { sumOfDeductions };
    }

    if (sumAll === true) {
      let total = 0;
      let countPub = 0;

      pubAndDeduction.forEach(obj => {
        ++countPub;
        obj.deductions.forEach(dedObj => {
          total += dedObj.deduction;
        });
      });

      return { sumOfDeductions: { sumOfDeduction: total, countPub } };
    }
  } catch (error) {
    console.log(error.message);
    return { sumOfDeductions: [] };
  }
};

module.exports = {
  upsertDeduction,
  getTotalDeductionByDate,
  checkExpiredDeduction,
  generateDateQuery,
  compareByDate,
  findDeductions,
  allowedSymbols,
  createDeductionSchema,
  delDeductionById,
  getSumOfDeductions
}
