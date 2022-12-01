const Base = require('../../Base');
const { ServerError } = require('./../../../handlers/errorHandlers');
const { canReadAllUsers } = require('./helpers');
class UpdateDomain extends Base {

  constructor(args) {
    super(args)
  }

  async execute({ body }) {

    const { id: userTokenId, permission } = body.additional;
    const params = {
      exclude: body.exclude,
      include: body.include,
      user: body.user
    }

    if (permission) {
      let status = undefined;
      switch (permission) {
        case "canReadAllUsers":
          status = await canReadAllUsers(params, userTokenId);
          break;
        case "canReadAllPubs":
          status = await canReadAllUsers(params, userTokenId);
          break;
        // case "canReadOwnPubs":
        //   list = await canReadOwnPubs(paramsId, userTokenId);
        //   break;
        default:
          throw new ServerError('FORBIDDEN', 'FORBIDDEN');
      }
      if (status.include.errors.status === 1 || 
          status.exclude.errors.status === 1) {
            const errorMessage = status.include.errors.status === 1 ? status.include.errors.message : status.exclude.errors.message;
            throw new ServerError(errorMessage, 'VALIDATION_FAIL');
        }

      return { success: true, msg: 'domains updated successful' };
    } else {
      throw new ServerError('FORBIDDEN', 'FORBIDDEN');
    }
  }
}

module.exports = UpdateDomain;