const mongoose = require('mongoose');
const User = mongoose.model('User');
const Base = require('./../Base');
const jwt = require('jsonwebtoken');
const { ServerError } = require('./../../handlers/errorHandlers');
const { ROLES } = require('../../constants/roles');

class Verify extends Base {
  constructor(args) {
    super(args);
  }

  async execute(token) {
    try {
      const status = await this.verify(token);

      if (!status) {
        throw new Error('TOKEN_EXPIRED');
      }

      return status;
    } catch (err) {
      throw new ServerError(err.message, 'UNAUTHORIZED', { expired: true });
    }
  }

  verify(token) {
    return new Promise((resolve, reject) => {
      const parsedToken = token.split(' ')[1];

      jwt.verify(parsedToken, process.env.SECRET, (err, decoded) => {
        if (err) {
          reject({ message: 'TOKEN_EXPIRED', status: 'UNAUTHORIZED', expired: true });
        }

        User.findOne({ uuid: decoded.data.id }, [
          '_id',
          'name',
          'permissions',
          'photo',
          'role',
          'wbidUserId',
          'am',
          'oRTBId',
          'oRTBType',
          'adWMGAdapter'
        ])
          .lean()
          .then((user) => {
            try {
              const result = {
                success: true,
                expired: false,
                message: 'TOKEN_VALID',
                user: {
                  name: user.name,
                  permissions: user.permissions,
                  _id: user._id,
                  photo: user.photo,
                  role: user.role,
                  wbidUserId: user.wbidUserId,
                  oRTBType: user.oRTBType,
                  oRTBId: user.oRTBId,
                  adWMGAdapter: user.adWMGAdapter
                }
              };

              if (user.role === ROLES.PUBLISHER && user.am) {
                User.findById(user.am, ['name', 'email'])
                  .lean()
                  .then((accManager) => {
                    result.user.am = {
                      name: accManager.name,
                      email: accManager.email
                    };

                    resolve(result);
                  });
              } else {
                resolve(result);
              }
            } catch (error) {
              reject({ message: 'TOKEN_EXPIRED', status: 'UNAUTHORIZED', expired: true });
            }
          });
      });
    });
  }
}

module.exports = Verify;
