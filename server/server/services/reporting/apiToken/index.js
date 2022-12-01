const mongoose = require('mongoose');
const Users = mongoose.model('User');
const APIToken = require('../../../database/mongoDB/migrations/APITokenModel');
const Base = require('../../Base');
const jwt = require('jsonwebtoken');
const { ServerError } = require('../../../handlers/errorHandlers');

class SetterApiToken extends Base {
  constructor(args) {
    super(args)
  }

  async execute({ body }) {

    const user = await this.findUser(body.additional);

    const result = {
      message: 'API_TOKEN_VALID'
    };
    if (user.has_token && user.user.api_token !== null) {
      const token_status = await APIToken.setExpireDate(user);
      result.token = user.user.api_token;
      result.expired = user.user.expired;
      if (token_status === 'API_TOKEN_EXPIRED') {
        const newToken = await this.createToken(user);
        result.token = newToken.token;
        result.expired = newToken.expired;
        result.message = newToken.message;
      }
    } else if (!user.has_token || user.user.api_token === null) {
      const newToken = await this.createToken(user);
      result.token = newToken.token;
      result.expired = newToken.expired;
      result.message = newToken.message;
    } else {
      result.token = 'No Token For Now'
    }

    return result;
  }

  createToken({ user, has_token }) {
    return new Promise((resolve) => {
      const perm = this.findPerm(user);
      try {
        const secretWords = process.env.SECRET_API_TOKEN;
        const token = jwt.sign({ data: {
            id: user.refs_to_user._id,
            permission: perm
          }
        }, secretWords, {
          expiresIn: 7776000,
          algorithm: 'HS256'
        });

        jwt.verify(token, secretWords, (err, decoded) => {

          if (!err) {
            const saveObj = {
              api_token: token,
              refs_to_user: decoded.data.id,
              expired: false
            }
            if (!has_token) {
              APIToken.create(saveObj).then(tok => {
                console.log('Token saved successful')
              });
            } else if (has_token) {
              APIToken.updateOne({ refs_to_user: decoded.data.id }, saveObj).then(tok => {
                console.log('Token updated successful')
              });
            }
            resolve({
              token,
              expired: false,
              message: 'API_TOKEN_REFRESHED'
            })
          }
        });

      } catch (error) {
        console.error(error);
        throw new ServerError('API_TOKEN_EXPIRED', 'UNAUTHORIZED')
      }
    })
  }

  async findUser(userId) {
    const result = {
      has_token: true
    };
    const user = await APIToken.find({ refs_to_user: userId.id })
      .populate({ path: 'refs_to_user', select: 'name permissions _id' })
      .then(tokenObj => {
        if (tokenObj.length === 0) {
          result.has_token = false;
          userId._id = userId.id;
          // return Users.find({ _id: id });
        }
        return tokenObj;
      });
    result.user = user[0] ? user[0] : { refs_to_user: userId };
    return result;
  }

  findPerm(user) {
    const possiblePerms = ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports'];
    let perm = '';
    possiblePerms.some(el => {
      if (user.refs_to_user.permissions.includes(el)) {
        return perm = el;
      }
    });
    return perm;
  }
}

module.exports = SetterApiToken;
