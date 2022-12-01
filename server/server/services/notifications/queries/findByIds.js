const { isValidObjectId } = require('mongoose');
const buildErrorObj = require('../../helperFunctions/buildErrorObj');
const Notifications = require('../../../database/mongoDB/migrations/NotificationsModel');

const findByIds = async (params) => {
  const beginOfError = 'Error in find Notifications by ids';

  try {
    const { usersId, dateFrom, returnValues = '' } = params;

    if (!Array.isArray(usersId)) {
      throw buildErrorObj('usersId must be as array.');
    }
    if (!usersId.length) {
      throw buildErrorObj('usersId is empty.');
    }
    if (!usersId.every((id) => isValidObjectId(id))) {
      throw buildErrorObj('not all id is not valid mongoose objects.');
    }

    return await Notifications.find({ refs_to_user: usersId, createdAt: { $gte: dateFrom } }, returnValues).lean();
  } catch (error) {
    console.log(error && error.msg ? error.msg : error.message);
    return { error: { msg: error && error.msg ? `${beginOfError}, ${error.msg}` : beginOfError } };
  }
};

module.exports = findByIds;
