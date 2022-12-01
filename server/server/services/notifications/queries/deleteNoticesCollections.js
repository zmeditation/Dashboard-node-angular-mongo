const { isValidObjectId } = require("mongoose");
const Notifications = require("../../../database/mongoDB/migrations/NotificationsModel");
const buildErrorObj = require("../../helperFunctions/buildErrorObj");

const deleteNoticesCollections = async(userId, msgTypes) => {
    const beginOfError = 'Error in deleteAllMsgs function';
    const msgTypesExists = ['systemNf', 'userNf', 'billingNf'];

    try {
        if (!isValidObjectId(userId)) { throw buildErrorObj('userId is not type of Mongo ObjectId.')}
        if (!msgTypes.every((msgType) => msgTypesExists.includes(msgType))) { throw buildErrorObj('msgType is not valid.')}

        const deleteObj = await Notifications.deleteMany({ refs_to_user: userId, msgType: { $in: msgTypes} });

        if (!deleteObj) { throw buildErrorObj('by specified query.')}

        return {
            error: null,
            deletedCount: deleteObj.deletedCount
        }
    } catch (error) {
        console.log( error && error.msg ? `${beginOfError}, ${error.msg}` : error.message);
        return { error: { msg: error && error.msg ? `${beginOfError}, ${error.msg}` : beginOfError}};
    }
}

module.exports = deleteNoticesCollections;