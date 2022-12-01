const mongoose = require('mongoose');
const PermissionModel = mongoose.model('Permissions');
const Base = require('./../Base');

const permissionId = process.env.PERMISSION_ID;

class RemoveRole extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ roleId }) {
        await PermissionModel.updateOne(
            { "_id": permissionId, "pre_defined": { "$elemMatch": { "_id": roleId }}},
            {$pull : { "pre_defined" : { "_id" : roleId }}}
        );

        return { success: true, msg: 'ROLE_SUCCESSFULLY_REMOVED' };
    }
}

module.exports = RemoveRole;