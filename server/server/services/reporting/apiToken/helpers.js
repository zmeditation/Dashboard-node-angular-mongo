const mongoose = require('mongoose');
const APITokens = mongoose.model('APIToken');
const jwt = require('jsonwebtoken');
const { ServerError } = require('../../../handlers/errorHandlers');

exports.ServiceForAPIReq = (req) => {
  const { body, params } = req;
  const result = { body };

  result.body.request = {
    type: params.type,
    range: !params.range ? 'custom' : params.range,
    interval: 'daily',
    customRange: {
      dateFrom: !params.range ? params.dateFrom : '',
      dateTo: !params.range ? params.dateTo : ''
    },
    filters: [],
    metrics: params.metrics.split(','),
    dimensions: params.dimensions.split(',')
  };
  return result;
}

exports.verifyToken = () => {
  return (req, res, next) => {
    const { token } = req.params;
    try {
      const secretWords = process.env.SECRET_API_TOKEN;
      jwt.verify(token, secretWords, async (err, decoded) => {
        // console.log(err, decoded)
        if (decoded) {
          const savedToken = await APITokens.find({ refs_to_user: decoded.data.id });
          
          if (savedToken.length === 0 || savedToken[0].api_token !== token) {
            return res.status(401).send({ msg: 'UNAUTHORIZED' });
          };
          
          req.body.additional = {
            expired: false,
            permission: decoded.data.permission,
            id: decoded.data.id
          };
          next();
        }
        if (err) {
          return res.status(401).send({ msg: 'API_TOKEN_EXPIRED' });
        }
      });
    } catch (error) {
      throw new ServerError('API_TOKEN_EXPIRED', 'UNAUTHORIZED');
    }
  }
}