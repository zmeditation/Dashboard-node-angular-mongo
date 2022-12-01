const { ERRORS } = require("../../constants/errors");
const { ServerError } = require("../../handlers/errorHandlers");
const { validationResult } = require('express-validator-next');

function ValidationWrapper(validationRules) {
    return async (request, response, next) => {
        await Promise.all(validationRules.map(validation => validation.run(request)));
        const errorInstance = validationResult(request);
        if (errorInstance.isEmpty()) {
            return next();
        }
        const message = errorInstance.array().map(({ msg }) => msg).join('. ');
        next(new ServerError(message, ERRORS.VALIDATION_FAIL));
    };
}

module.exports = { ValidationWrapper };
