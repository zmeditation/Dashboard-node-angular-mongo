const mongoose = require('mongoose');
const User = mongoose.model('User');
const moment = require('moment');

const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');

class DownloadReport extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ body: { additional: { permission, id: userTokenId } }, filterId}) {

        if (permission) {
            let results = undefined;
            switch (permission) {
                case "canDownloadReports":
                    results = await this.download(userTokenId);
                    break;
                default:
                    throw new ServerError('FORBIDDEN', 'FORBIDDEN');
            }

            if (!results) { throw new ServerError('REPORT_RETRIEVAL_ERROR', 'BAD_REQUEST')}

            return {
                success: true,
                downloadUrl: results.path,
                name: `${moment().format('YYYY-MM-DD')}-${results.id}`
            }
        } else {
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }
    }

    async download(userTokenId) {
        const { generatedReport, uuid } = await User.findOne({ _id: userTokenId });
        if (!generatedReport) { throw new ServerError('USER_HAS_ZERO_REPORTS', 'BAD_REQUEST') }

        return {
            path: `${__dirname}/../../../dist/exported/${generatedReport}.csv`,
            id: uuid
        }
    }

}

module.exports = DownloadReport;