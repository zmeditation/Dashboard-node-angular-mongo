const Reports = require('../../../database/mongoDB/migrations/reportModel');
const User = require('../../../database/mongoDB/migrations/UserModel');
const { handleErrors } = require('../../helperFunctions/handleErrors');
const Iterator = require('../../../utils/iterator');
const { inventory } = require('./inventory');

const rewriteReportsObjects = async (params) => {
  try {
    const { arrayOfIds } = params;
    const allowedSizesForSize = inventory.getAllowedSizes();

    const rewritedObjects = await Reports.updateMany({ _id: arrayOfIds }, [
      {
        $set: {
          inventory: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: ['$inventory_sizes', 'Native']
                  },
                  then: {
                    sizes: '1x1',
                    width: 1,
                    height: 1,
                    inventory_type: 'Native'
                  }
                },
                {
                  case: {
                    $and: [
                      { $in: ['$inventory_sizes', allowedSizesForSize] },
                      { $or: [{ $eq: ['$inventory_type', 'banner'] }, { $eq: ['$inventory_type', 'display'] }] }
                    ]
                  },
                  then: {
                    sizes: '$inventory_sizes',
                    width: { $arrayElemAt: [{ $split: ['$inventory_sizes', 'x'] }, 0] },
                    height: { $arrayElemAt: [{ $split: ['$inventory_sizes', 'x'] }, 1] },
                    inventory_type: 'banner'
                  }
                },
                {
                  case: {
                    $or: [
                      { $eq: ['$inventory_sizes', 'Video/Overlay'] },
                      { $eq: ['$inventory_sizes', 'Inpage'] },
                      { $eq: ['$inventory_type', 'video'] }
                    ]
                  },
                  then: {
                    sizes: 'Video/Overlay',
                    width: 0,
                    height: 0,
                    inventory_type: 'video'
                  }
                },
                {
                  case: {
                    $and: [
                      { $not: [{ $in: ['$inventory_sizes', allowedSizesForSize] }] },
                      { $or: [{ $eq: ['$inventory_type', 'banner'] }, { $eq: ['$inventory_type', 'display'] }] },
                      { $ne: ['$inventory_sizes', 'Inpage'] }
                    ]
                  },
                  then: {
                    sizes: 'Fluid',
                    width: { $arrayElemAt: [{ $split: ['$inventory_sizes', 'x'] }, 0] },
                    height: { $arrayElemAt: [{ $split: ['$inventory_sizes', 'x'] }, 1] },
                    inventory_type: 'banner'
                  }
                },
                {
                  case: {
                    $and: [
                      { $eq: ['$inventory_sizes', 'unknown'] },
                      { $or: [{ $eq: ['$inventory_type', 'banner'] }, { $eq: ['$inventory_type', 'video'] }] }
                    ]
                  },
                  then: {
                    sizes: 'unknown',
                    width: -1,
                    height: -1,
                    type: '$inventory_type'
                  }
                }
              ],
              default: null
            }
          }
        }
      }
    ]);

    return rewritedObjects;
  } catch (error) {
    return handleErrors(error, 'rewriteReportsObjects');
  }
};

// Will execute if some reports not have inventory obj
const addReportsFields = async (userId) => {
  const user = await User.findById(userId, 'role').lean();
  if (user.role !== 'ADMIN') return;

  const countNotInventoryReport = await Reports.countDocuments({ inventory: { $exists: false } });
  console.log('countNotInventoryReport ////', countNotInventoryReport);
  if (!countNotInventoryReport) return;

  // const reportsCount = await Reports.countDocuments({});
  // console.log('reportsCount /////', reportsCount);

  const allReportsId = await getAllReportsIds();

  const obj = {
    from: 0,
    to: countNotInventoryReport, // change number
    limit: 5000,
    asyncFunction: editReportsByIdRange,
    asyncFunctionParams: {
      allReportsId
    }
  };
  const iterateObj = Iterator.generateAsyncLimitIterator(obj);

  for await (let value of iterateObj) {
    console.log('iterateObj', value);
  }
};

const editReportsByIdRange = async (params, objectFromIterate) => {
  const { allReportsId } = params;
  const { plus, now } = objectFromIterate;
  const arrayOfIds = allReportsId.slice(now, now + plus);

  return await rewriteReportsObjects({ arrayOfIds });
};

// Return array of ids
const getAllReportsIds = async () => {
  const findedReportsId = await Reports.find({ inventory: { $exists: false } }, '_id').lean();
  console.log('findedReportsId[0]', findedReportsId[0]);
  const arrayOfIds = findedReportsId.map((el) => el._id);

  return arrayOfIds;
};

const deleteReportsFieldById = async (params) => {
  // fields, reportsId - arrays of strings
  const { arrayOfIds, fields } = params;

  const result = await Reports.updateMany({ _id: arrayOfIds }, [
    {
      $unset: fields
    }
  ]);

  return result;
};

module.exports = {
  addReportsFields,
  deleteReportsFieldById
};
