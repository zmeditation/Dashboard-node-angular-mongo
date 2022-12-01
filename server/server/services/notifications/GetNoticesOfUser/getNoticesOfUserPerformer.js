const { getPastDate } = require('../../helperFunctions/dateFunctions');
const buildErrorObj = require('../../helperFunctions/buildErrorObj');
const { handleErrors } = require('../../helperFunctions/handleErrors');
const deleteNoticesById = require('../queries/deleteNoticesById');
const findByIds = require('../queries/findByIds');

const getNoticesOfUserPerformer = async (userId) => {
  try {
    const userNotifications = {
      systemNf: [],
      userNf: [],
      billingNf: []
    };

    const findUserParams = {
      usersId: [userId],
      dateFrom: getPastDate(3)
    };
    const noticeArray = await findByIds(findUserParams);
    if (!noticeArray) {
      throw buildErrorObj('by ids.');
    }

    noticeArray.forEach((obj) => {
      userNotifications[obj.msgType].push(obj);
    });

    for (const [key, array] of Object.entries(userNotifications)) {
      if (array.length) {
        userNotifications[key].sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
      }
    }

    const maxSumAllowedMsg = 200;
    await deleteExtraNotices(maxSumAllowedMsg, userNotifications);

    return {
      userNotifications
    };
  } catch (error) {
    const beginOfError = 'Error in getNoticesOfUserPerformer';
    return handleErrors(error, beginOfError);
  }
};

const deleteExtraNotices = async (maxSumAllowedMsg, userNotifications) => {
  for (const [key, array] of Object.entries(userNotifications)) {
    if (array.length > maxSumAllowedMsg) {
      const noticeForDelete = userNotifications[key].splice(maxSumAllowedMsg);
      const noticeForDeleteIds = noticeForDelete.map((notice) => notice._id);
      await deleteNoticesById(noticeForDeleteIds);
    }
  }
};

module.exports = { getNoticesOfUserPerformer };

// const Notifications = require("../../../database/mongoDB/migrations/NotificationsModel");
// const all = await Notifications.deleteMany();
// console.log('Deletcount', all);
// const newMsgs = {
//     msg: { event: 'reports', trigger: 'Amazon', typeMsg: 'success' },
//     msgType: 'userNf',
//     refs_to_user: '5e81cf8f0fe3300960b9c659'
// }
// const newMs = {
//     msg: { event: 'reports', trigger: 'Amazon', typeMsg: 'success' },
//     msgType: 'systemNf',
//     refs_to_user: '5e81cf8f0fe3300960b9c659'
// }

// const msgs = await Notifications.insertMany([newMsgs, newMs]);
