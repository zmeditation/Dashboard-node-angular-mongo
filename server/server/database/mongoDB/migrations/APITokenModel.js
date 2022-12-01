const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const apiTokenSchema = new Schema({
  api_token: {
    type: String,
    trim: true,
    default: null
  },
  refs_to_user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  },
  expired: {
    type: Boolean,
    default: true
  }
});

apiTokenSchema.index({ _id: 1, refs_to_user: 1, expired: 1 }, { unique: true });

apiTokenSchema.plugin(require('mongoose-timestamp'));

apiTokenSchema.statics = {
  async setExpireDate(tokenObj) {
    const jwt = require('jsonwebtoken');
    const secretWords = process.env.SECRET_API_TOKEN;
    return jwt.verify(tokenObj.user.api_token, secretWords, async (err, decoded) => {
        if (decoded) {
          const savedToken = await this.find({ refs_to_user: decoded.data.id });

          if (savedToken.length === 0 || savedToken[0].api_token !== tokenObj.user.api_token) {
            return 'API_TOKEN_EXPIRED';
          };
        
          return 'API_TOKEN_VALID';
        }
        if (err) {
          return 'API_TOKEN_EXPIRED';
        }
      });
  }
}

module.exports = mongoose.model('APIToken', apiTokenSchema);