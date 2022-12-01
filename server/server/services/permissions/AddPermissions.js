const mongoose = require('mongoose');
const PermissionModel = mongoose.model('Permissions');
const Base = require('./../Base');
const { ServerError } = require('./../../handlers/errorHandlers');

class AddPermissions extends Base {
  constructor(args) {
    super(args);
  }

  async execute(data) {
    if (!data.length) {
      throw ServerError('FAILED_DB_QUERY', 'BAD_REQUEST');
    }

    const permissionPromises = [];

    for (const currentPermission of data) {
      const permission = new PermissionModel(currentPermission);
      permissionPromises.push(permission.save());
    }

    const permissions = await Promise.all(permissionPromises);

    if (!permissions) {
      throw ServerError('FAILED_DB_QUERY', 'BAD_REQUEST');
    }

    return permissions;
  }
}

module.exports = AddPermissions;
