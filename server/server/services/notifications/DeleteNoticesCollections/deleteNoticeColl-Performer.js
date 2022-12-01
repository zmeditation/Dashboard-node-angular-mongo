const buildErrorObj = require('../../helperFunctions/buildErrorObj');
const deleteNoticesCollections = require('../queries/deleteNoticesCollections');

const deleteNoticesCollactions = async (query) => {
  const beginOfError = 'Error to delete notice collections';

  try {
    const { userId, msgTypes: types } = query;
    const msgTypes = types.split(',');

    const { deletedCount, error } = await deleteNoticesCollections(userId, msgTypes);
    if (error !== null) {
      throw buildErrorObj('by query.');
    }

    return {
      error: null,
      deletedCount
    };
  } catch (error) {
    console.log(error && error.msg ? error.msg : error.message);
    return { error: { msg: error && error.msg ? `${beginOfError}, ${error.msg}` : beginOfError } };
  }
};

module.exports = { deleteNoticesCollactions };
