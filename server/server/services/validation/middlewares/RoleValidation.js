const { body } = require('express-validator-next');

function RoleValidation(roles, path = 'role') {
    return body(path).isIn(roles).withMessage(`Role should be ${Object.values(roles)}.`)
}

module.exports = { RoleValidation };
