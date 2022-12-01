const Base = require('../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');
const { deleteNoticesCollactions } = require('./deleteNoticeColl-Performer');

class DeleteNoticesCollections extends Base {
  constructor(args) {
    super(args);
  }

  async execute({
    body: {
      additional: { permission }
    },
    query
  }) {
    try {
      if (permission) {
        let deletedCount, error;

        switch (permission) {
          case 'canDeleteOwnNotice':
            ({ deletedCount, error } = await deleteNoticesCollactions(query));
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

module.exports = DeleteNoticesCollections;
