const mongoose = require('mongoose');
const User = mongoose.model('User');
const Base = require('./../Base');
const jwt = require('jsonwebtoken');
const { ERRORS } = require('../../constants/errors');
const { ALLOWED_PUBLISHER_VIEW_PERMISSIONS } = require('../../constants/permissions');
const { ServerError } = require('./../../handlers/errorHandlers');

class Authenticate extends Base {
  async execute(userId) {
    console.log("DDDD", data)
    const user = await User.findById(userId, [
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
    ]);

    if (!user || !user.enabled.status) {
      console.log("UIF", user, userId, user?.enabled)
      throw new ServerError('User not found', ERRORS.NOT_FOUND);
    }

    const sessionInfo = {
      id: user.uuid,
      isPublisherView: true,
    };

    const token = jwt.sign({ data: sessionInfo }, process.env.SECRET, {
      expiresIn: 3 * 60 * 60 * 1000,
      algorithm: 'HS256'
    });

    const publisherViewPermissions = user.permissions.filter(
      perm => ALLOWED_PUBLISHER_VIEW_PERMISSIONS.includes(perm)
    );

    const result = {
      success: true,
      msg: 'SUCCESSFUL SIGNED AS PUBLISHER',
      token: `Bearer ${token}`,
      user: {
        permissions: publisherViewPermissions,
        photo: user.photo,
        name: user.name,
        email: user.email,
        _id: user._id,
        role: user.role,
        wbidUserId: user.wbidUserId,
        oRTBType: user.oRTBType,
        oRTBId: user.oRTBId,
        adWMGAdapter: user.adWMGAdapter,
      }
    };

    // replace with populate
    if (user.am) {
      result.user.am = await User.findById(user.am, [ 'name', 'email' ]).lean();
    }

    return result;
  }
}

module.exports = Authenticate;
