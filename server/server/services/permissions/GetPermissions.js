const mongoose = require('mongoose');
const PermissionModel = mongoose.model('Permissions');
const permissionId = process.env.PERMISSION_ID;

const Base = require('./../Base');

class GetPermissions extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ query }) {
        if (Object.keys(query).length && query.r === 'true') {
            const permissions = await PermissionModel.findOne({ _id: permissionId }, { _id: 0, 'pre_defined.name': 1 });
            return {
                success: true,
                permissions
            }
        }

        const permissions = await PermissionModel.findOne({ _id: permissionId });
        return {
            success: true,
            permissions
        }
    }
}

module.exports = GetPermissions;
