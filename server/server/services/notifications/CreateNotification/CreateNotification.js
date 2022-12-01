const Base = require('../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');
const { createNotification } = require('./ceateNotification-Performer');
const cluster = require('cluster');

class CreateNotification extends Base {
  constructor(args) {
    super(args);
  }

  async execute({
    body: {
      additional: { permission },
      params
    }
  }) {
    try {
      if (permission) {
        let createdMsgs, error;

        switch (permission) {
          case 'canCreateNotification':
            ({ createdMsgs, error } = await createNotification(params));
            break;

          default:
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }

        if (error !== null) {
          throw error;
        }

        return {
          error,
          createdMsgs
        };
      }
    } catch (error) {
      console.log(error.message && error.message);
      throw new ServerError(`${error && error.msg ? error.msg : 'ERROR TO CREATE NOTIFICATION'}`, 'BAD_REQUEST');
    }
  }
}

module.exports = CreateNotification;
