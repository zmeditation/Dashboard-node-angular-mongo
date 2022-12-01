const { canReadAllUsers } = require('./helpers');
const Base = require('./../../Base');
const { ServerError } = require('./../../../handlers/errorHandlers');

class AddNewDomain extends Base {
  constructor(args) {
      super(args);
  }

  async execute({ body }) {

    const { id: userTokenId, permission } = body.additional;

    if (permission) {
      let status = undefined;
      switch (permission) {
        case "canReadAllUsers":
          status = await canReadAllUsers(body.new_domain, userTokenId);
          break;
        case "canReadAllPubs":
          list = await canReadAllUsers(body.new_domain, userTokenId);
          break;
        // case "canReadOwnPubs":
        //   list = await canReadOwnPubs(paramsId, userTokenId);
        //   break;
        default:
          throw new ServerError('FORBIDDEN', 'FORBIDDEN');
      }

      if (status.errors) { throw new ServerError(status.errors.errors.domain.message, 'VALIDATION_FAIL')}

      return { success: true, msg: 'domain created successful', domain: status.domain };
    } else {
      throw new ServerError('FORBIDDEN', 'FORBIDDEN');
    }
  }
}

module.exports = AddNewDomain;