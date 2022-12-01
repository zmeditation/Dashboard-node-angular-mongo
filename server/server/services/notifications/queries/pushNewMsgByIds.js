const { isValidObjectId } = require('mongoose');
const Notifications = require('../../../database/mongoDB/migrations/NotificationsModel');
const buildErrorObj = require('../../helperFunctions/buildErrorObj');
const { handleErrors } = require('../../helperFunctions/handleErrors');

// Push new msg to user || users by Ids to their notification collections by msg type [systemNf || userNf || billingNf]
// usersIdsArray example [{refs_to_user: '23434km423mj4kj3'}]
const pushNewMsgByIds = async (usersIdsArray, msgType, msg) => {
  const beginOfError = 'Error in push new msg to Notifications collection,';
  const msgTypes = ['systemNf', 'userNf', 'billingNf'];

  try {
    if (!usersIdsArray?.length) {
      throw buildErrorObj('usersIdsArray not array or empty.');
    }
    if (!usersIdsArray.every((obj) => isValidObjectId(obj.refs_to_user))) {
      throw buildErrorObj('not all id is not valid mongoose objects.');
    }
    if (!msgTypes.includes(msgType)) {
      throw buildErrorObj('msgType is not valid.');
    }
    if (!msg) {
      throw buildErrorObj('not have msg object.');
    }

    const newMsgs = usersIdsArray.map((obj) => {
      return {
        ...obj,
        msgType,
        msg
      };
    });

    const msgs = await Notifications.insertMany(newMsgs);

    return {
      error: null,
      createdMsgs: msgs.length
    };
  } catch (error) {
    return handleErrors(error, beginOfError);
  }
};

module.exports = pushNewMsgByIds;

// const newMsgs = {
//     msg: { event: 'reports', trigger: 'Amazon', typeMsg: 'success' },
//     msgType: 'userNf',
//     refs_to_user: '5e81cf8f0fe3300960b9c659'
// }
