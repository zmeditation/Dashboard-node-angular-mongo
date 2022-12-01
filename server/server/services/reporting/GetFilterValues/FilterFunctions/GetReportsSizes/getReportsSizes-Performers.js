const Reports = require('../../../../../database/mongoDB/migrations/reportModel');
const buildErrorObj = require('../../../../helperFunctions/buildErrorObj');
const { handleErrors } = require('../../../../helperFunctions/handleErrors');
const User = require('../../../../../database/mongoDB/migrations/UserModel');
const { addReportsFields } = require('../../../helperFunctions/editReportsCollection');
const { REPORT_FILTERS } = require('../../../../../constants/reportFilters');

const getInventorySizes = async (userId) => {
  try {
    const { isPub } = await isPublisher(userId);
    if (isPub) {
      const { pubSizesInfo, error } = await getPublisherRepSizes(userId);
      if (error) return { error };
      return pubSizesInfo;
    }
    // inventory === null in
    // RTB House {
    //     inventory_sizes: '970x90',
    //     inventory_type: 'display',
    // }
    // Smart {
    //     inventory_sizes: '0x0',
    //     inventory_type: 'video',
    // }

    // AppNexus {
    //     inventory_sizes: '1x1',
    //     inventory_type: 'video',
    // }

    // Rubicon does not have  inventory_sizes inventory_type
    // Amazon does not have  inventory_sizes inventory_type
    // Criteo does not have  inventory_sizes inventory_type
    // PubMatic does not have  inventory_sizes inventory_type
    // MyTarget does not have  inventory_sizes inventory_type
    // Google Ad Manager does not have  inventory_sizes inventory_type
    // Google Ad Manager HB does not have  inventory_sizes inventory_type

    // inventory === undefined in [ 'AppNexus', 'Google Ad Manager HB', 'MyTarget', 'Smart' ]
    //    await addReportsFields(userId);
    const size = await Reports.distinct('inventory.sizes', { ad_request: { $gt: 1000 }, 'property.refs_to_user': { $type: 'objectId' } })
      .lean()
      .exec();

    const unique = size.slice(0, 250).filter((el) => el.length >= 3 && el.length < 10);

    return {
      error: null,
      _id: REPORT_FILTERS.SIZES,
      name: 'SIZES',
      results: unique
    };
  } catch (error) {
    return handleErrors(error, ' in getInventorySizes');
  }
};

const searchReportsSizes = async (userId, params = {}) => {
  const beginOfError = 'Error in getReportsSizesPagination';

  try {
    const { search } = params;
    if (!search) {
      throw buildErrorObj('search object is not found');
    }
    const regex = new RegExp(`^${search}`);

    const { isPub } = await isPublisher(userId);
    if (isPub) {
      const { pubSizesInfo, error } = await getPublisherRepSizes(userId, regex);
      if (error) return { error };
      return pubSizesInfo;
    }

    const sizes = await Reports.distinct('inventory.sizes', {
      'inventory.sizes': { $regex: regex }
      // 'property.refs_to_user': { $type: 'objectId' }
    }).lean();

    return {
      error: null,
      _id: REPORT_FILTERS.SIZES,
      name: 'SIZES',
      results: sizes
    };
  } catch (error) {
    return handleErrors(error, beginOfError);
  }
};

const getPublisherRepSizes = async (userId, regex = '') => {
  try {
    const size = await Reports.findOne({ 'property.refs_to_user': userId })
      .distinct('inventory.sizes', { 'inventory.sizes': { $regex: regex } })
      .lean()
      .exec();
    const unique = size.slice(0, 250).filter((el) => el.length >= 3 && el.length < 10);

    return {
      pubSizesInfo: {
        error: null,
        _id: REPORT_FILTERS.SIZES,
        name: 'SIZES',
        results: unique
      }
    };
  } catch (error) {
    return handleErrors(error, 'Error in getPublisherRepSizes');
  }
};

const isPublisher = async (userId) => {
  try {
    const user = await User.findById(userId, 'role').lean();
    if (user.role === 'PUBLISHER') {
      return { isPub: true };
    }

    return { isPub: false };
  } catch (error) {
    return handleErrors(error, 'isPublisher');
  }
};

module.exports = {
  getInventorySizes,
  searchReportsSizes
};
