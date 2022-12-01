const mongoose = require('mongoose');
const PermissionModel = mongoose.model('Permissions');
const User = mongoose.model('User');
const permissionId = process.env.PERMISSION_ID;

const Base = require('./../Base');

class RemovePermission extends Base {
    constructor(args) {
        super(args);
        
    }

    async execute(body) {
        const id = permissionId;
        const permission = body.body.perm_to_delete;

        const permissionsPromise = PermissionModel.updateOne({ _id: id}, { $pull: { permissions: permission } });
        const descriptionPromise = PermissionModel.updateMany(
            { "descriptions": { "$elemMatch": { "name": permission }}},
            { $pull : { "descriptions" : { "name" : permission }}}
        );

        const permissionsObject = await PermissionModel.findOne({_id: id});
        
        // Временая функция, нужно удалить все лишние имена пермишинов.
        permissionsObject.permissions.forEach((permName, i) => {
            let isExistPerm = false;

            permissionsObject.descriptions.forEach((obj) => {
                if (obj.name === permName) {
                    isExistPerm = true;
                }
            });

            if (!isExistPerm) {
                permissionsObject.permissions.splice(i, 1);
                console.log(`Not needed permission name ${permName} deleted`);
            }
        });

        for (const role of permissionsObject.pre_defined) {
            if (role.permissions.includes(permission)) {
                const index = role.permissions.indexOf(permission);
                role.permissions.splice(index, 1)
            }
        }

        await User.removePermission(permission);
        await permissionsObject.save();
        await Promise.all([ permissionsPromise, descriptionPromise ]);

        return { success: true, msg: 'PERMISSION_SUCCESSFULLY_REMOVED' }
    }
}

module.exports = RemovePermission;