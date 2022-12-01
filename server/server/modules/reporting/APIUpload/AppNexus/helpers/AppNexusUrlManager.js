const sendReport = require('../../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { httpsRequest } = require('../../helperFunctions/httpsRequest');
const { isJson } = require('../../../../../services/helperFunctions/stringFunctions');
const { checkResponseOnError } = require('../../../../../handlers/checkResponseOnError');


class AppNexusUrlManager {
    constructor() {
        this.programmatic = 'AppNexus';
        this.sendReportMessage = {
            event: 'reports', 
            trigger: this.programmatic, 
            typeMsg: 'error', 
            text: null
        };
    }

    async getReportUrl(options) {
        const reportJobId = await this.getReportJobId(options);
        const downloadUrlParams = { 
            token: options.token, 
            reportJobId 
        };
        const downloadUrl = await this.getReportDownloadURL(downloadUrlParams);
        return downloadUrl;
    }

    getReportJobId(options) {
        return new Promise((resolve) => {
            const { reportID, token } = options;
            if (!reportID) { throw 'missing reportID' }
            if (!token) { throw 'missing token' }

            const reqOptions = {
                method: 'POST',
                hostname: 'api.appnexus.com',
                path: `/report?saved_report_id=${reportID}`,
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
            };

            const customText = `${this.programmatic} getReportJobId`;
            httpsRequest({ options: reqOptions, customText })
                .then(resopnse => {
                    this.handleResponseJobId(resopnse)
                        .then(resolve);
                })
                .catch(() => sendReport({ message: this.sendReportMessage }));
        });
    }

    

    handleResponseJobId(response) {
        return new Promise((resolve) => {
            try {
                const responseObject = isJson(response) ? JSON.parse(response) : null; 

                if (!responseObject) { throw 'response is not JSON object' }
                const { response: { status } } = responseObject;
                
                if (status === 'OK') {
                    const { response: { report_id } } = responseObject;
                    return resolve(report_id);
                } else if (status === 'error') {
                    const { response: { error_id, error }} = responseObject;
                    throw `${error_id} ${status}: ${error}`;
                } else {
                    throw response;
                }
            } catch (error) {
                const customText = `${this.programmatic}, getReportJobId response is not valid.`;
                checkResponseOnError({ error, customText })
                    .catch(() => sendReport({ message: this.sendReportMessage }));
            }
        });
    }

    getReportDownloadURL(params) {
        return new Promise( async(resolve) => {
            try {
                const { token, reportJobId } = params;
                const reqOptions = {
                    method: 'GET',
                    hostname: 'api.appnexus.com',
                    path: `/report?id=${reportJobId}`,
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                };
                let statusObject = await this.getReportStatusAndUrl(reqOptions);
    
                while (statusObject.status !== 'ready') {
                    statusObject = await this.getReportStatusAndUrl(reqOptions);
                    if (statusObject.status === 'ready') {
                        break;
                    }
                }
    
                resolve(statusObject.url);
            } catch (err) {
                const customText = `${this.programmatic}, error in getReportDownloadURL`;
                checkResponseOnError({ error, customText })
                    .catch(() => sendReport({ message: this.sendReportMessage }));
            }
        })
    }
    
    getReportStatusAndUrl(reqOptions) {
        return new Promise(resolve => {
            if (!reqOptions) { throw 'getReportStatusAndUrl, reqOptions not valid' }
            const customText = `${this.programmatic}, error in getReportStatusAndUrl`;

            httpsRequest({ options: reqOptions, customText })
                .then(resopnse => {
                    this.handleResponseStatusAndUrl(resopnse)
                        .then(resolve);
                })
                .catch(() => sendReport({ message: this.sendReportMessage }));
        });
    }

    handleResponseStatusAndUrl(response) {
        return new Promise((resolve) => {
            try {
                const responseObject = isJson(response) ? JSON.parse(response) : null; 
                if (!responseObject) { throw 'responseObject not valid' }
                
                const { response: { status, execution_status } } = responseObject;
                
                if (status === 'OK') {
                    if (execution_status === 'ready') {
                        const { response: { report: { url }}} = responseObject;
                        resolve({ status: execution_status, url });
                    } else {
                        resolve({ status: execution_status, url: undefined });
                    }
                } else {
                    throw 'status not equal OK';
                }
            } catch (error) {
                const customText = `${this.programmatic}, handleResponseStatusAndUrl response is not valid.`;
                checkResponseOnError({ error, customText })
                    .catch(() => sendReport({ message: this.sendReportMessage }));
            }
        });
    }
}

const appNexusUrlManager = new AppNexusUrlManager();
module.exports = { appNexusUrlManager };
