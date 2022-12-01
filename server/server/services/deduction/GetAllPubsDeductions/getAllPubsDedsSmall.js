const { findAvailablePublisherDeductions } = require('../deductionsHelper/filteringAvailablePublishers.js');
const { findDeductions } = require('../deductionsHelper/helper.js');

exports.getAllOwnAndAccountDeds = async (userId, typeOfDeepQuery) => {
  try {
    const { availablePubs, errorAvailablePubs } = await findAvailablePublisherDeductions(userId, typeOfDeepQuery);
    if (errorAvailablePubs !== null) {
      return { error: errorAvailablePubs };
    }

    const { publishersAndDeductions, error } = await findDeductions(availablePubs);
    if (error !== null) {
      return { error };
    }

    return {
      publishersAndDeductions,
      error: null
    };
  } catch (error) {
    console.log(error);
    return { error: { msg: `GET_DEDUCTION_ERROR_ ${error.path || error.msg} ` } };
  }
};

exports.getAllDeductions = async () => {
  try {
    const { publishersAndDeductions, error } = await findDeductions('ALL');
    if (error !== null) {
      return { error };
    }

    return {
      publishersAndDeductions,
      error: null
    };
  } catch (error) {
    console.dir(error && error.msg ? error : error.message);
    return { error: { msg: `GET_DEDUCTION_ERROR_ ${error.path || error.msg} ` } };
  }
}