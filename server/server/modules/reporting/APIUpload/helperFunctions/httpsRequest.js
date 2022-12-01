const https = require('https');
const { handleErrors } = require('../../../../services/helperFunctions/handleErrors');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');

const collectDataFromHttps = (resolve, response) => {
  const data = [];

  response.setEncoding('utf8');
  response.on('data', (chunk) => {
    data.push(chunk);
  });

  response.on('end', () => {
    const joinedData = data.join('');
    resolve(joinedData);
  });
};

const httpsRequest = (params) => {
  const { options, callBack = collectDataFromHttps, customText, bodyChunk } = params;
  return new Promise((resolve, reject) => {
    try {
      // Set first argument to function
      const curryFuncWithOneParamLeft = callBack.bind(undefined, resolve);
      const request = https.request(options, curryFuncWithOneParamLeft);

      request.on('error', (error) => {
        handleErrors(error, customText);
        checkResponseOnError({ error, customText }).catch(reject);
      });

      bodyChunk && request.write(bodyChunk);
      request.end();
    } catch (error) {
      const errorResponse = {
        statusCode: error.code || 400,
        statusMessage: error.message
      };

      handleErrors(error);
      checkResponseOnError({ response: errorResponse, error, customText, runNext: false }).catch(reject);
    }
  });
};

module.exports = {
  httpsRequest,
  collectDataFromHttps
};
