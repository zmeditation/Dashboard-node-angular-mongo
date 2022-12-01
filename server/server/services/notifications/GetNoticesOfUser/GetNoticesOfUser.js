const Base = require('../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');
const { getNoticesOfUserPerformer } = require('./getNoticesOfUserPerformer');

class GetNoticesOfUser extends Base {
  constructor(args) {
    super(args);
  }

  async execute({
    body: {
      additional: { permission }
    },
    userId
  }) {
    try {
      if (permission) {
        let userNotifications, error;

        switch (permission) {
          case 'canReadOwnNotices':
            ({ userNotifications, error } = await getNoticesOfUserPerformer(userId));
            break;

          default:
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }

        if (error) {
          throw error;
        }

        return {
          success: true,
          userNotifications,
          error
        };
      }
    } catch (error) {
      throw new ServerError(`${error && error.msg ? error.msg : 'ERROR TO GET USER NOTICE'}`, 'BAD_REQUEST');
    }
  }
}

module.exports = GetNoticesOfUser;
