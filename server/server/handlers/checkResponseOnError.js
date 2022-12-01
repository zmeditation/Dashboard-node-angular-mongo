const { findValidString } = require("../services/helperFunctions/arrayFunctions");
const { allErrorCodes } = require("../constants/errors");
const { isJson } = require("../services/helperFunctions/stringFunctions");
const { nextManager } = require("./getNext");


const checkResponseOnError = (params) => {
	return new Promise((resolve, reject) => {
		try {
			const { response, error: receivedErr, customText, runNext = true } = params;

			if (!response && receivedErr) {
				const unknownError = {
						statusCode: 520,
						statusMessage: 'Unknown Error',
						customText,
						error: receivedErr
				} 
				
				runNext && nextManager.throw(unknownError);
				return reject(unknownError);
			} else if (!receivedErr) {
				const unknownError = {
					statusCode: 520,
					statusMessage: 'Not valid response and error received from third part.',
					customText
				} 
				
				runNext && nextManager.throw(unknownError);
				return reject(unknownError);
			}
				
			const { statusCode, statusMessage, data, body } = response;
			const badRequestCode = 400;
				
			if (statusCode === 200) {
				return resolve({ error: null })
			}
				
			const isExitTheError = allErrorCodes.get(statusCode);
			const statusC = isExitTheError ? statusCode : badRequestCode;
			
			const foundString = findValidString([ data, body, receivedErr, statusMessage ]);
			const error = ((isJson(foundString) && JSON.parse(foundString)) || foundString ) 
				|| allErrorCodes.get(statusC);
			
			const statusM = (typeof statusMessage === 'string' && statusMessage.length < 70) 
				? statusMessage 
				: allErrorCodes.get(statusC);
			
			const requestError = {
				statusCode: statusC,
				statusMessage: statusM,
				customText,
				error
			}
			
			runNext && nextManager.throw(requestError);
			reject(requestError);
		} catch (error) {
			reject(error);
		}
	});
}
    
module.exports = {
	checkResponseOnError
};