const { body } = require('express-validator-next');

function ObjectIdValidation(field, expressInstance = body) {
    return expressInstance(field).isMongoId().withMessage(value => `Field ${field} should be a HEX string. Got ${value}.`)
}

module.exports = { ObjectIdValidation };
