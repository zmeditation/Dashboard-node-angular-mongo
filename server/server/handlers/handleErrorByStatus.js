const { allErrorCodes } = require("../constants/errors");

const responseByStatusCode = (errorCatched, req, res, next) => {
    const badRequestCode = 400;
    const badRequestMsg = allErrorCodes.get(badRequestCode);
    const { statusCode, statusMessage, customText, error } = errorCatched;

    const msgByCode = allErrorCodes.get(statusCode);
    const statusC = msgByCode ? statusCode : badRequestCode;
        
    const statusM = (typeof statusMessage === 'string' && statusMessage) 
        || msgByCode 
        || badRequestMsg;

    const response = {
        statusCode: statusC,
        statusMessage: statusM,
        customText,
        error
    }

    res.status(response.statusCode).json({ msg: response.statusMessage, response });
    return { response };
}

module.exports = {
    responseByStatusCode
}