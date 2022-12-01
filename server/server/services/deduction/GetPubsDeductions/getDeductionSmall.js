const { generateDateQuery, compareByDate, findDeductions } = require('../deductionsHelper/helper');
const { findAvailablePublisherDeductions } = require('../deductionsHelper/filteringAvailablePublishers');
const { handleErrors } = require('../../helperFunctions/handleErrors');

exports.canReadAllDeductions = async (query) => {
  try {
    const {
      range,
      customRange: { dateFrom, dateTo },
      managersId,
      showDetailedDeductions,
    } = query;
    let { publishersId } = query;

    if (!publishersId || (Array.isArray(publishersId) && publishersId.length === 0)) {
      publishersId = 'ALL';
    }

    const { formDate, toDate, error: errorDate } = await generateDateQuery(range, dateFrom, dateTo);
    if (errorDate) {
      throw errorDate;
    }

    const { publishersAndDeductions, error } = await findDeductions(publishersId, managersId, showDetailedDeductions);
    if (error) {
      throw error;
    }

    const publishersCompared = await compareByDate(publishersAndDeductions, formDate, toDate);
    if (!publishersCompared) throw 'publishersCompared is not valid';

    return publishersCompared;
  } catch (error) {
    const customText = 'Error in canReadAllDeductions';
    throw handleErrors(error, customText).error;
  }
};

exports.canReadOwnAndAccountDedsByType = async (query, userId, typeOfDeepQuery) => {
  try {
    const {
      range,
      customRange: { dateFrom, dateTo },
      publishersId = [],
      managersId,
      showDetailedDeductions,
    } = query;

    const { formDate, toDate, error: errorDate } = await generateDateQuery(range, dateFrom, dateTo);
    if (errorDate) throw errorDate;

    const { availablePubs, errorAvailablePubs } = await findAvailablePublisherDeductions(userId, typeOfDeepQuery);
    if (errorAvailablePubs) throw errorAvailablePubs;

    const userAvailableIds = publishersId.length > 0 ? publishersId.filter((id) => availablePubs.includes(id)) : availablePubs;

    const { publishersAndDeductions, error } = await findDeductions(
      userAvailableIds, 
      managersId, 
      showDetailedDeductions
    );

    if (error) {
      throw error;
    }

    const publishersCompared = await compareByDate(publishersAndDeductions, formDate, toDate);
    if (!publishersCompared) throw 'publishersCompared is not valid';

    return publishersCompared;
  } catch (error) {
    const customText = 'Error in canReadOwnAndAccountDedsByType';
    throw handleErrors(error, customText).error;
  }
};

exports.canReadOwnDeductions = async (query, userId) => {
  try {
    const {
      range,
      customRange: { dateFrom, dateTo },
      showDetailedDeductions,
    } = query;

    const { formDate, toDate, error: errorDate } = await generateDateQuery(range, dateFrom, dateTo);
    if (errorDate) {
      throw errorDate;
    }

    const { publishersAndDeductions, error } = await findDeductions(userId, null, showDetailedDeductions);
    if (error) {
      throw error;
    }

    const publishersCompared = await compareByDate(publishersAndDeductions, formDate, toDate);
    if (!publishersCompared) throw 'publishersCompared is not valid';

    return publishersCompared;
  } catch (error) {
    const customText = 'Error in canReadOwnDeductions';
    throw handleErrors(error, customText).error;
  }
};
