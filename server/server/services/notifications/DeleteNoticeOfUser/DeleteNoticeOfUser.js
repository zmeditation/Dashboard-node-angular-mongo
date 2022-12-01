const Base = require('../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');
const { deleteNoticeOfUserPerformer } = require('./deleteNoticeOfUser-Performer');

class DeleteNoticeOfUserPerformer extends Base {
  constructor(args) {
    super(args);
  }

  async execute({
    body: {
      additional: { permission }
    },
    msgId
  }) {
    try {
      if (permission) {
        let deletedCount, error;

        switch (permission) {
          case 'canDeleteOwnNotice':
            ({ deletedCount, error } = await deleteNoticeOfUserPerformer(msgId));
            break;

          default:
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }

        if (error !== null) {
          throw error;
        }

        return {
          deletedCount,
          error
        };
      }
    } catch (error) {
      console.log(error);
      console.log(error.message && error.message);
      throw new ServerError(`${error && error.msg ? error.msg : 'ERROR TO DELETE USER NOTICE'}`, 'BAD_REQUEST');
    }
  }
}

module.exports = DeleteNoticeOfUserPerformer;
