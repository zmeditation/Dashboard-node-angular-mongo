const Notifications = require('../../../database/mongoDB/migrations/NotificationsModel');
const buildErrorObj = require('../../helperFunctions/buildErrorObj');
const { handleErrors } = require('../../helperFunctions/handleErrors');

const getDateMonthAgo = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return new Date(date);
};

const deleteNoticesByDate = async (date = getDateMonthAgo()) => {
  try {
    const lessDate = date instanceof Date && !isNaN(date);
    if (!lessDate) {
      throw buildErrorObj('date is not valid.');
    }

    const deleteObj = await Notifications.deleteMany({ createdAt: { $lte: date } });
    if (!deleteObj) {
      throw buildErrorObj('by specified query.');
    }

    return deleteObj.deletedCount;
  } catch (error) {
    const beginOfError = 'Error in deleteNoticesByDate';
    throw handleErrors(error, beginOfError);
  }
};

module.exports = deleteNoticesByDate;
