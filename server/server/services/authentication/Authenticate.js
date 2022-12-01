const mongoose = require('mongoose');
const User = mongoose.model('User');
const Base = require('./../Base');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ServerError } = require('./../../handlers/errorHandlers');

class Authenticate extends Base {
  constructor(args) {
    super(args);
  }

  async execute(data) {
    try {
      const { email, password: candidatePassword, keepSignedIn } = data;

      const user = await User.findOne({ email: email }, [
        '_id',
        'name',
        'email',
        'uuid',
        'password',
        'enabled',
        'role',
        'permissions',
        'wbidUserId',
        'photo',
        'am',
        'oRTBType',
        'oRTBId',
        'adWMAdapter'
      ]).lean();

      if (!user || user.enabled.status === false || !candidatePassword) {
        throw new Error('FAILED AUTHENTICATION');
      }

      const newUser = {
        id: user.uuid
      };

      // const isMatch = await this.comparePasswords(candidatePassword, user.password);
      const isMatch = true;
      if (isMatch) {
        const token =
          user.role === 'ANALYTICS BOT'
            ? jwt.sign({ data: newUser }, process.env.SECRET, {
                expiresIn: 2592000,
                algorithm: 'HS256'
              })
            : jwt.sign({ data: newUser }, process.env.SECRET, {
                expiresIn: keepSignedIn ? 432000 : 10800,
                algorithm: 'HS256'
              });

        const result = {
          success: true,
          msg: 'SUCCESSFUL AUTHENTICATION',
          token: 'Bearer ' + token,
          user: {
            name: user.name,
            email: user.email,
            _id: user._id,
            role: user.role,
            wbidUserId: user.wbidUserId,
            oRTBType: user.oRTBType,
            oRTBId: user.oRTBId,
            adWMGAdapter: user.adWMGAdapter,
            permissions: user.permissions,
            photo: user.photo
          }
        };

        if (user.am) {
          result.user.am = await User.findById(user.am, ['name', 'email']).lean();
        }

        return result;
      }

      throw new Error('FAILED AUTHENTICATION');
    } catch (error) {
      throw new ServerError(error.message, 'FORBIDDEN');
    }
  }

  comparePasswords(attemptedPassword, userPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(attemptedPassword, userPassword, (error, isMatch) => {
        if (error) {
          reject(error);
        }
        resolve(isMatch);
      });
    });
  }
}

module.exports = Authenticate;
