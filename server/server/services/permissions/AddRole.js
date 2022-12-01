const mongoose = require('mongoose');
const PermissionModel = mongoose.model('Permissions');
const Base = require('./../Base');

const permissionId = process.env.PERMISSION_ID;

class AddRole extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ body }) {
        const id = permissionId;
        const role = {
            name: body.name,
            permissions: body.permissions
        };

        await PermissionModel.updateOne({_id: id}, { $addToSet: { pre_defined: role }});

        return { success: true, msg: 'ROLE_SUCCESSFULLY_ADDED' };
    }
}

module.exports = AddRole;