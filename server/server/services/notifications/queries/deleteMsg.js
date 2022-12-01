const { isValidObjectId } = require('mongoose');
const Notifications = require('../../../database/mongoDB/migrations/NotificationsModel');
const buildErrorObj = require('../../helperFunctions/buildErrorObj');
const { handleErrors } = require('../../helperFunctions/handleErrors');

const deleteMsg = async (msgId) => {
  try {
    if (!isValidObjectId(msgId)) {
      throw buildErrorObj('msgId is not type of Mongo ObjectId.');
    }

    const deleteObj = await Notifications.deleteOne({ _id: msgId });
    if (!deleteObj) {
      throw buildErrorObj('by specified query.');
    }

    return deleteObj.deletedCount;
  } catch (error) {
    const beginOfError = 'Error in deleteMsg';
    throw handleErrors(error, beginOfError);
  }
};

module.exports = deleteMsg;
