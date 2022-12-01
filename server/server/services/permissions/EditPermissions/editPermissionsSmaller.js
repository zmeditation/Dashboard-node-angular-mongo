const mongoose = require('mongoose');
const buildErrorObj = require('../../helperFunctions/buildErrorObj');
const User = mongoose.model('User');
const PermissionModel = mongoose.model('Permissions');
const permissionId = process.env.PERMISSION_ID;

exports.editPermissions = async (query) => {
  try {
    const { typeOfAction, publisherId, permissions, role } = query;
    const eventsForOneUser = {
      'DELETION_FOR_ONE': deleteForOne,
      'ADDING_FOR_ONE': addingForOne
    }
    const eventsForAllUsers = {
      'DELETION_FOR_ALL': deletionForAll,
      'ADDING_FOR_ALL': addingForAll
    }

    const executeForOneUser = eventsForOneUser[typeOfAction];
    const executeForAllUsers = eventsForAllUsers[typeOfAction];
    if (!executeForOneUser && !executeForAllUsers) {
      throw buildErrorObj('permission action is not valid')
    }

    const { error, userEdited, usersExist, editedPerm } = executeForOneUser ?
      await executeForOneUser(publisherId, permissions) :
      await executeForAllUsers(permissionId, permissions, role);
    if (error !== null) {
      throw error
    }

    return {
      error,
      userEdited,
      usersExist,
      editedPerm
    }
  } catch (error) {
    console.log(error && error.msg ? error.msg : error.message);
    return { error: { msg: error && error.msg ? error.msg : 'Error to edit permissions' } };
  }

}

const deleteForOne = async (publisherId, permissions) => {
  try {
    const results = await User.updateOne({ _id: publisherId },
      {
        $pullAll: {
          "permissions": permissions
        }
      }
    ).exec();

    return {
      error: null,
      userEdited: results.nModified,
      usersExist: results.n
    };
  } catch (error) {
    return { error: { msg: 'Failed to delete permission' } }
  }
}

const addingForOne = async (publisherId, permissions) => {
  try {
    const results = await User.updateOne({ _id: publisherId },
      {
        $addToSet: {
          "permissions": permissions
        }
      }
    ).exec();

    return {
      error: null,
      userEdited: results.nModified,
      usersExist: results.n
    };
  } catch (error) {
    return { error: { msg: 'Failed to add permission' } }
  }
}

const deletionForAll = async (permissionId, permissions, role) => {
  try {
    const results = await User.updateMany({ role: role },
      {
        $pullAll: {
          "permissions": permissions
        }
      }
    ).exec();

    const deletedPerm = await PermissionModel.updateOne({ _id: permissionId, "pre_defined.name": role },
      {
        $pullAll: {
          'pre_defined.$.permissions': permissions
        }
      }
    ).exec();

    return {
      error: null,
      userEdited: results.nModified,
      usersExist: results.n,
      editedPerm: deletedPerm.nModified
    };
  } catch (error) {
    return { error: { msg: 'Failed to delete permissions' } }
  }
}

const addingForAll = async (permissionId, permissions, role) => {
  try {
    const results = await User.updateMany({ role: role },
      {
        $addToSet: {
          "permissions": permissions
        }
      }
    ).exec();

    const addPerm = await PermissionModel.updateOne({ _id: permissionId, "pre_defined.name": role },
      {
        $addToSet: {
          'pre_defined.$.permissions': permissions
        }
      }
    ).exec();

    return {
      error: null,
      userEdited: results.nModified,
      usersExist: results.n,
      editedPerm: addPerm.nModified
    };
  } catch (error) {
    return { error: { msg: 'Failed to add permissions' } }
  }
}
