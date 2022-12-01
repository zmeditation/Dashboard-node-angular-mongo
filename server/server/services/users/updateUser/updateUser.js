/** @format */

const mongoose = require('mongoose');
const User = mongoose.model('User');
const { getCommissionAndCurrentCwe } = require('./getCommissionAndCurrentCwe');
const { canEditAllUsers } = require('./updateUserSmaller');

const Base = require('../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');

// POST: api/users/update/:id
// updates a specific user in the DB.

class UpdateUser extends Base {
  constructor(args) {
    super(args);
  }

  async execute({
    body: {
      additional: { permission, permissions, id: userTokenId },
      userObject
    },
    paramsId
  }) {
    if (!permissions.includes('canEditCommission')) {
      const { commission, cwe } = await getCommissionAndCurrentCwe(paramsId, userObject);
      userObject['commission'] = commission;
      userObject['cwe'] = cwe;
    }

    if (permission) {
      let user, currentUserData;

      switch (permission) {
        case 'canEditAllUsers':
          currentUserData = await User.findOne({ _id: paramsId });

          await this.checkUserEmail(currentUserData, userObject);

          user = await canEditAllUsers(currentUserData, userObject, paramsId);
          break;
        case 'canConnectUnitWithPub':
          currentUserData = await User.findOne({ _id: paramsId });

          await this.checkUserEmail(currentUserData, userObject);

          user = await canEditAllUsers(currentUserData, userObject, paramsId);
          break;
        // case "canEditAllPubs":
        //     user = await canEditAllPubs(userObject, paramsId);
        //     break;
        // case "canEditOwnPubs":
        //     user = await canEditOwnPubs(userObject, paramsId, userTokenId);
        //     break;
        default:
          throw new ServerError('FORBIDDEN', 'FORBIDDEN');
      }

      if (!user) {
        throw new ServerError('ERROR_WHILE_ADDING_USER', 'BAD_REQUEST');
      }

      return {
        success: true,
        msg: 'USER_UPDATED',
        userObject: {
          _id: user['_id'],
          uuid: user['uuid'],
          name: user['name'],
          email: user['email'],
          additional: user['additional'],
          role: user['role'],
          permissions: user['permissions'],
          domains: user['domains'],
          properties: user['properties'],
          commission: user['commission'],
          cwe: user['cwe'],
          connected_users: user['connected_users'],
          am: user['am'],
          sam: user['sam'],
          enabled: user['enabled'],
          wbidType: user['wbidType'],
          wbidUserId: user['wbidUserId'],
          oRTBType: user['oRTBType'],
          oRTBId: user['oRTBId'],
          adWMGAdapter: user['adWMGAdapter'],
          isTest: user.is_test
        }
      };
    } else {
      throw new ServerError('FORBIDDEN', 'FORBIDDEN');
    }
  }

  /**
   *
   * @param {any} currentUserData
   * @param {any} updateUserData
   * @returns {Promise<boolean|never>}
   */
  async checkUserEmail(currentUserData, updateUserData) {
    if (currentUserData.email === updateUserData.email) {
      return true;
    }

    const isEmailExist = await User.findOne({ email: updateUserData.email });

    if (isEmailExist) {
      throw new ServerError('ERROR_EMAIL_ALREADY_EXIST', 'CONFLICT');
    }

    return true;
  }
}

module.exports = UpdateUser;
