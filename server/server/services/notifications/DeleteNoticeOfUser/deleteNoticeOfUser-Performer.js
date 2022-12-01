const { handleErrors } = require('../../helperFunctions/handleErrors');
const deleteMsg = require('../queries/deleteMsg');

const deleteNoticeOfUserPerformer = async (msgId) => {
  try {
    const deletedCount = await deleteMsg(msgId);

    return {
      error: null,
      deletedCount
    };
  } catch (error) {
    const beginOfError = 'Error in deleteNoticeOfUserPerformer';
    return handleErrors(error, beginOfError);
  }
};

module.exports = { deleteNoticeOfUserPerformer };
