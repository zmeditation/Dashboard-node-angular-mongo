const { isValidObjectId } = require('mongoose');
const Notifications = require('../../../database/mongoDB/migrations/NotificationsModel');
const buildErrorObj = require('../../helperFunctions/buildErrorObj');
const { handleErrors } = require('../../helperFunctions/handleErrors');

const deleteNoticesById = async (noticesId) => {
  const beginOfError = 'Error in deleteNoticesById';

  try {
    if (!Array.isArray(noticesId)) {
      throw buildErrorObj('noticesId is not array.');
    }
    if (!noticesId.length) {
      console.log('deleteNoticesById, noticesId is empty array');
      return {
        error: null,
        deletedCount: 0
      };
    }
    if (!noticesId.every((id) => isValidObjectId(id))) {
      throw buildErrorObj('userId is not type of Mongo ObjectId.');
    }

    const deleteObj = await Notifications.deleteMany({ _id: { $in: noticesId } });
    if (!deleteObj) {
      throw buildErrorObj('by specified query.');
    }

    return {
      error: null,
      deletedCount: deleteObj.deletedCount
    };
  } catch (error) {
    return handleErrors(error, beginOfError);
  }
};

module.exports = deleteNoticesById;
