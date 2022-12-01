const { canReadAllUsers, canReadAllPubs, canReadOwnPubs, getUserIfSameId } = require('./getUserSmaller');
const Base = require('../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');

// GET: api/users/get/:id
// gets the requested user if the header includes the correct permission

export default class GetUser extends Base {
  constructor(args) {
    super(args);
  }

  async execute({ body, paramsId, query: { fields } }) {
    const { id: userTokenId, permission } = body.additional;
    fields = fields ? fields.split(',') : [];

    if (userTokenId == paramsId && (permission === 'canReadOwnPubs' || permission === 'canReadOwnAccountInfo')) {
      const user = await getUserIfSameId({ paramsId, fields });
      if (!user) {
        throw new ServerError('USER_NOT_FOUND', 'BAD_REQUEST');
      }

      return user;
    } else {
      if (permission) {
        let user = undefined;
        switch (permission) {
          case 'canReadAllUsers':
            user = await canReadAllUsers({ paramsId, fields });
            break;
          case 'canReadAllPubs':
            user = await canReadAllPubs({ paramsId, fields });
            break;
          case 'canReadOwnPubs':
            user = await canReadOwnPubs({ paramsId, userTokenId, fields });
            break;
          default:
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }

        if (!user) {
          throw new ServerError('USER_NOT_FOUND', 'BAD_REQUEST');
        }

        return user;
      } else {
        throw new ServerError('FORBIDDEN', 'FORBIDDEN');
      }
    }
  }
}
