const mongoose = require('mongoose');
const User = mongoose.model('User');
const ReportModel = mongoose.model('Reports');

exports.canDeletePreviouslyUploadedReports = (reportId, userTokenId) => {
    return new Promise(async resolve => {
        const reportPromise = ReportModel.findOneAndDelete({ _id: reportId, uploaded_by: userTokenId });
        const userPromise = User.findOneAndUpdate({ _id: userTokenId }, { $pull: { "previouslyUploadedReports": reportId }});

        const [ report, user ] = await Promise.all([ reportPromise, userPromise ]);

        if (report && user) {
            resolve('REPORT_SUCCESSFULLY_DELETED');
        } else {
            resolve(null);
        }
    })
};