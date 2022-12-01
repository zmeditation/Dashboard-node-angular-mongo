const buildErrorObj = require('../../helperFunctions/buildErrorObj');
const { isArrayAndLength } = require('../../helperFunctions/checkArray');
const { handleErrors } = require('../../helperFunctions/handleErrors');
const { sendMsgByRoles, sendPersonalNotice } = require('../../websocket/websocket_service');

const createNotification = async (params) => {
  const beginOfError = 'Error in createNotification';

  try {
    const { msg, msgType, userRoles, usersId } = params;
    const event = 'notifications';
    const isCorrectUsersId = isArrayAndLength([usersId]);
    const isCorrectUserRole = isArrayAndLength([userRoles]);
    let createdMsgs = 0;
    let error = null;

    if (!msg) {
      throw buildErrorObj('msg is not exist.');
    }
    if (!msg.event) {
      throw buildErrorObj('msg must have event.');
    }
    if (!msg.text || !msg.text.replace(/\s/g, '')) {
      throw buildErrorObj('msg text is not correct.');
    }

    if (isCorrectUsersId && isCorrectUserRole) {
      const params = { event, usersId, msg, msgType };

      ({ error, createdMsgs } = await sendPersonalNotice(params));
      if (error !== null) {
        throw error;
      }
    } else if (isCorrectUserRole) {
      const msgInfo = { event, roleReceivers: userRoles, message: msg, msgType };

      ({ error, createdMsgs } = await sendMsgByRoles(msgInfo));
      if (error !== null) {
        throw error;
      }
    }

    return {
      error,
      createdMsgs
    };
  } catch (error) {
    return handleErrors(error, beginOfError);
  }
};

module.exports = { createNotification };
