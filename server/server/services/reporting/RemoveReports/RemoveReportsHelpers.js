const mongoose = require('mongoose');
const ReportModel = mongoose.model('Reports');
const CommissionReports = mongoose.model('Commission_Reports');
const moment = require('moment');

exports.canDeleteReports = async ( { programmatic, publisher, properties, dateFrom, dateTo } ) => {
    const noReports = 'NO_REPORTS_TO_DELETE';

    try {
        dateFrom = moment(dateFrom).set({hour: 0, minutes: 0, seconds: 0});
        dateTo = moment(dateTo).set({hour: 23, minutes: 59, seconds: 59});
        [dateFrom, dateTo] = moment(dateFrom).unix() > moment(dateTo).unix() ? [dateTo, dateFrom] : [dateFrom, dateTo];

        const { deletedCount, error: errorOfDeletion } = await typeOfDeletion(programmatic, publisher, properties, dateFrom, dateTo);
        if (errorOfDeletion !== null) throw errorOfDeletion;

        return deletedCount !== 0 ? `${deletedCount} REPORTS_WERE_SUCCESSFULLY_DELETED` : noReports;

    } catch (error) {
        console.log('Error in RemoveReportsHelpers');
        console.dir( error && error.msg ? error : error.message );
        return noReports;
    }
};

exports.canDeleteCommissionReports = async ({ programmatic, dateFrom, dateTo }) => {
    dateFrom = moment(dateFrom).set({hour: 0, minutes: 0, seconds: 0});
    dateTo = moment(dateTo).set({hour: 23, minutes: 59, seconds: 59});

    [dateFrom, dateTo] = moment(dateFrom).unix() > moment(dateTo).unix() ? [dateTo, dateFrom] : [dateFrom, dateTo];

    const reportPromise = CommissionReports.deleteMany({ day: { $gte: dateFrom, $lte: dateTo }, report_origin: programmatic });

    const [ status ] = await Promise.all([ reportPromise ]);

    return status.n ? 'COMMISSION_REPORTS_WERE_SUCCESSFULLY_DELETED' : 'NO_COMMISSION_REPORTS_TO_DELETE';
};

const typeOfDeletion = (programmatic, publisher, properties, dateFrom, dateTo) => {
    const errorOfDeletion = `Error in deletion reports for programmatic ${programmatic}`;
    const path = 'server/services/reporting/RemoveReports/RemoveReportsHelpers.js';

    try {

        return new Promise((resolve, reject) => {

            const mongoQuery = properties.length === 0 ? {
                day: { $gte: dateFrom, $lte: dateTo },
                report_origin: programmatic,
                'property.refs_to_user': publisher
            } : {
                day: { $gte: dateFrom, $lte: dateTo },
                report_origin: programmatic,
                'property.refs_to_user': publisher,
                'property.property_id': { $in: properties }
            }

            if (!publisher) {

                ReportModel.deleteMany( {

                    day: { $gte: dateFrom, $lte: dateTo },
                    report_origin: programmatic
                },
                    (err, doc) => {

                        if (err) reject({ error: { msg: errorOfDeletion, path }});
                        resolve({deletedCount: doc.deletedCount, error: null});
                    }
                );

            } else {

                ReportModel.deleteMany(mongoQuery,
                    (err, doc) => {

                        if (err) reject({ error: { msg: `${errorOfDeletion} and publisher ${publisher}`, path }});
                        resolve({deletedCount: doc.deletedCount, error: null});
                    }
                );
            }
        });
    } catch (error) {
        console.log('Error in typeOfDeletion');
        console.dir( error && error.msg ? error : error.message );
    }
}
