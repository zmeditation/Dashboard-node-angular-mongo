const mongoose = require('mongoose');
const PermissionModel = require('../../database/mongoDB/migrations/permissionModel');
const User = mongoose.model('User');
const Base = require('./../Base');

const permissionId = process.env.PERMISSION_ID;

class AddPermission extends Base {
  constructor(args) {
    super(args);
  }

  async execute({ body }) {
    const id = permissionId;
    const list = body.roles;
    const result = await PermissionModel.find({ "descriptions.type": body.description.type }).then(async el => {
      if (el.length === 0) {
        return { success: false, message: 'NO_THIS_TYPE_OF_PERMISSIONS' };
      }

      const userPromise = User.updateMany({
        role: { $in: list }
      }, {
        $addToSet: {
          permissions: body.permission
        }
      });
      const permissionPromise = PermissionModel.updateOne({ _id: id }, {
        $addToSet: {
          permissions: body.permission,
          descriptions: body.description
        }
      });

      await Promise.all([userPromise, permissionPromise]);

      for (const role of list)  {
        await PermissionModel.updateMany({
          _id: id,
          'pre_defined.name': role
        }, {
          $addToSet : {
          'pre_defined.$.permissions': body.permission
          }
        });
      }

      return { success: true, message: 'PERMISSION_SUCCESSFULLY_ADDED' };
    });

    return result;
  }
}

module.exports = AddPermission;
