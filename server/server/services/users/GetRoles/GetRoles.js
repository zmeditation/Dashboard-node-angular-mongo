const mongoose = require('mongoose');
const PermissionModel = mongoose.model('Permissions');

const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');

// Get Roles By Permission - To Refactor the Location Later

class GetRoles extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ body }) {
        const { permission } = body.additional;

        const roles = await PermissionModel.getRoles(permission);

        if (!roles) { throw new ServerError('UNABLE_TO_GET_ROLES', 'BAD_REQUEST' )}

        return { roles };
    }
}

module.exports = GetRoles;