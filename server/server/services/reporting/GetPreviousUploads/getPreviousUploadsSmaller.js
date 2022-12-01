const mongoose = require('mongoose');
const ReportModel = mongoose.model('Reports');
const User = mongoose.model('User');

exports.canReadPreviouslyUploadedReports = (userTokenId) => {
    return new Promise(async resolve => {
        const {  previouslyUploadedReports: reportIds } = await User.findOne({ _id: userTokenId }, { previouslyUploadedReports: 1, _id: 0 });

        const reports = await ReportModel.find(
            { _id: { $in: reportIds } },
            { commission: false, createdAt: false, updatedAt: false, uploaded_by: false })
            .sort({ createdAt: -1 });

        resolve(reports);
    })
};