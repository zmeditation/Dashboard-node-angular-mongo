const { canReadAllUsers, canReadAllPubs } = require('./helpers');
const Base = require('./../../Base');
const { ServerError } = require('./../../../handlers/errorHandlers');

class GetDomains extends Base {
  constructor(args) {
      super(args);
  }

  async execute(req) {
    const { body, query } = req; 
    const { id: userTokenId, permission } = body.additional;

    if (permission) {
      let list = undefined;
      switch (permission) {
        case "canReadAllUsers":
          list = await canReadAllUsers(query);
          break;
        case "canReadAllPubs":
          list = await canReadAllPubs(query);
          break;
        case "canReadOwnPubs":
          list = await canReadAllPubs(query);
          break;
        default:
          throw new ServerError('FORBIDDEN', 'FORBIDDEN');
      }

      if (!list) { throw new ServerError('DOMAINS_NOT_FOUND', 'BAD_REQUEST')}

      return list;
    } else {
      throw new ServerError('FORBIDDEN', 'FORBIDDEN');
    }
  }
}

module.exports = GetDomains;