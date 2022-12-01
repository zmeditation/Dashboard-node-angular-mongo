const fs = require("fs-extra");
const axios = require('axios');
const getAuthenticatedClient = require('./AuthRun');
const Base = require('../../../../services/Base');
const {ServerError} = require('../../../../handlers/errorHandlers');

let WbidUrl = `http://${process.env.WBID_ENDPOINT}/`;

      /**
         * Add each baseURL variable to .env file of current environment, NODE_ENV
         */

// switch (process.env.NODE_ENV) {
//     case 'production': {
//         WbidUrl = 'http://45.76.85.95:9999/';
//         break;
//     }
//     case 'staging': {
//         WbidUrl = 'http://45.76.85.245:9999/';
//         break;
//     }
//     case 'development': {
//         WbidUrl = 'http://localhost:9999/';
//     }
// }

class Auth extends Base {
    constructor(args) {
        super(args);
    }

    async execute({body}) {
        const {permission} = body.additional;
        const {networkId, socket} = body;
        const id = body.additional.wbidUserId;

        if (permission && permission === 'canSeeWBidIntegrationPage') {
            if (networkId && id && socket) {
                const data = await getAuthenticatedClient(body);

                await fs.outputJson(`${__dirname}/token.json`, data);
                console.dir('Send data to WBID server...');
                await axios.post(`${WbidUrl}/dfpSetup`,
                    {token: JSON.stringify(data), networkId, id, socket},
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                return {success: true, message: 'Token successfully saved', url: ['wbid', 'start', 'wait']};

            } else throw new ServerError('Incorrect network ID value', 'BAD_REQUEST')

        } else throw new ServerError('FORBIDDEN', 'FORBIDDEN');
    }
}

module.exports = Auth;
