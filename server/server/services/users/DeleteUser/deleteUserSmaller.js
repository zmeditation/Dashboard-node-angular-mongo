const mongoose = require("mongoose");
const User = mongoose.model("User");
const ReportModel = mongoose.model("Reports");
const Deduction = mongoose.model("Deduction");

exports.canDeleteAllUsers = (paramsId) => {
    return new Promise(async resolve => {
        try {

            const userPromise = User.findOneAndRemove({ _id: paramsId });

            const deductionPromise = Deduction.findOneAndRemove({refs_to_user: paramsId})

            const userReferencePromise = User.updateMany(
                { $or: [{ am: paramsId }, { sam: paramsId }] },
                { $set: { sam: null, am: null } }
            );

            const pullUserReferences = User.updateMany(
                { $or: [{ 'connected_users.p': paramsId }, { 'connected_users.am': paramsId }]},
                { $pull: { 'connected_users.p': paramsId, 'connected_users.am': paramsId } }
            );

            const reportPromise = ReportModel.updateMany(
                { 'property.refs_to_user': paramsId },
                { $set: { 'property.refs_to_user': null, 'property.am': null } }
            );

            await Promise.all([pullUserReferences, userPromise, reportPromise, userReferencePromise, deductionPromise]);

            resolve(true);
        } catch(e) {
            console.error(e);
            resolve(false);
        }

    });

};