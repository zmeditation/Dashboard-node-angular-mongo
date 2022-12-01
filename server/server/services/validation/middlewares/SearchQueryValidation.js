const { body } = require('express-validator-next');
const MAX = 140;
const rules = [
    body('search')
        .isString()
        .withMessage(value => `Must by a string. Got type ${typeof value}.`)
        .isLength({ max: MAX })
        .withMessage(value => `There are ${MAX} symbols maximum. Got ${value.length}.`),
];

module.exports = { SearchQueryValidation: rules };
