const fs = require('fs');
const sendReport = require('../../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');
const { httpsRequest } = require('../../helperFunctions/httpsRequest');
const { isJson } = require('../../../../../services/helperFunctions/stringFunctions');
const { checkResponseOnError } = require('../../../../../handlers/checkResponseOnError');

class AppNexusToken {
    constructor() {
        this.programmatic = 'AppNexus';
        this.sendReportMessage = {
            event: 'reports',
            trigger: this.programmatic,
            typeMsg: 'error',
            text: null
        };
    }

    async getToken(options, credentials) {
        return await this.isTokenValid(options)
            ? this.getTokenFromFile(options.tokenPath)
            : await this.updateToken(options.tokenPath, credentials);
    }

    isTokenValid(options) {
        return new Promise((resolve) => {
            try {
                const { reportID, tokenPath } = options;
                const token = this.getTokenFromFile(tokenPath);
                if (!token) { throw 'token not exist' }

                const reqOptions = {
                    method: 'POST',
                    hostname: 'api.appnexus.com',
                    path: `/report?saved_report_id=${reportID}`,
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                };

                const customText = `${this.programmatic} isTokenValid`;
                httpsRequest({ options: reqOptions, customText })
                    .then(response => {
                        this.handleResponseTokenValid(response)
                            .then(resolve);
                    })
                    .catch(() => sendReport({ message: this.sendReportMessage }));
            } catch (error) {
                const customText = `${this.programmatic}, isTokenValid token not valid.`;
                checkResponseOnError({ error, customText })
                    .catch(() => sendReport({ message: this.sendReportMessage }));
            }
        });
    }

    handleResponseTokenValid(response) {
        return new Promise((resolve) => {
            try {
                const responseObject = isJson(response) ? JSON.parse(response) : null;
                if (!responseObject) { throw 'response is not JSON object' }

                const { response: { status } } = responseObject;
                if (status === 'OK') {
                    resolve(true);
                } else {
                    const { response: { error_id } } = responseObject;
                    if (error_id && (error_id === 'NOAUTH' || error_id === 'SYNTAX')) {
                        console.log('Authentication is needed!');
                        resolve(false);
                    } else {
                        throw responseObject;
                    }
                }
            } catch (error) {
                const customText = `${this.programmatic}, handleResponseTokenValid response is not valid.`;
                checkResponseOnError({ error, customText })
                    .catch(() => sendReport({ message: this.sendReportMessage }));
            }
        });
    }

    getTokenFromFile(path) {
        return fs.readFileSync(path);
    }

    updateToken(path, credentials) {
        return new Promise((resolve) => {
            try {
                const body = {
                    auth: {
                        username: credentials.login,
                        password: credentials.password
                    }
                }
                const bodyJson = JSON.stringify(body);
                const reqOptions = {
                    method: 'POST',
                    hostname: 'api.appnexus.com',
                    path: '/auth',
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(bodyJson)
                    },
                }

                const customText = `${this.programmatic} updateToken`;
                httpsRequest({ options: reqOptions, customText, bodyChunk: bodyJson })
                .then(response => {
                    this.handleResponseUpdateToken(response, path)
                        .then(resolve);
                })
                .catch(() => sendReport({ message: this.sendReportMessage }));
            } catch (error) {
                const customText = `${this.programmatic}, updateToken error.`;
                checkResponseOnError({ error, customText })
                    .catch(() => sendReport({ message: this.sendReportMessage }));
            }
        });
    }

    handleResponseUpdateToken(response, path) {
        return new Promise((resolve) => {
            try {
                const responseObject = isJson(response) ? JSON.parse(response) : null;

                if (!responseObject) { throw 'response is not JSON object' }
                const { response: { status } } = responseObject;

                if (status !== 'OK') { throw responseObject }

                const { response: { token } } = responseObject;
                if (!token) { throw 'token not valid' }

                this.updateTokenFile(path, token);
                resolve(token);
            } catch (error) {
                const customText = `${this.programmatic}, handleResponseUpdateToken response is not valid.`;
                checkResponseOnError({ error, customText })
                    .catch(() => sendReport({ message: this.sendReportMessage }));
            }
        });
    }

    updateTokenFile(path, token) {
        return fs.writeFileSync(path, token);
    }
}

const appNexusToken = new AppNexusToken();
module.exports = {
    appNexusToken
}
