const User = require('../../../database/mongoDB/migrations/UserModel');
const buildErrorObj = require('../../helperFunctions/buildErrorObj');
const { handleErrors } = require('../../helperFunctions/handleErrors');

const findByRoles = async (userRoles, returnValues = '') => {
  const beginOfError = 'findByRoles';
  const roleTypes = ['ADMIN', 'CEO', 'AD OPS', 'SENIOR ACCOUNT MANAGER', 'ACCOUNT MANAGER', 'PUBLISHER', 'MEDIA BUYER', 'FINANCE MANAGER'];

  try {
    if (!Array.isArray(userRoles)) {
      throw buildErrorObj('userRoles must be as array.');
    }
    if (!userRoles?.length) {
      throw buildErrorObj('userRoles is empty.');
    }

    // Exist Problem, CEO MANAGER exist only on localhos.
    if (!userRoles.every((role) => roleTypes.includes(role))) {
      throw buildErrorObj('not all roles is valid.');
    }

    const usersIds = await User.find({ role: userRoles }, returnValues);
    if (!usersIds) {
      throw buildErrorObj('to call User.find');
    }

    return {
      error: null,
      usersIds
    };
  } catch (error) {
    return handleErrors(error, beginOfError);
  }
};

module.exports = findByRoles;
