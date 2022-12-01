const Base = require('../../../../services/Base');
const {ServerError} = require('../../../../handlers/errorHandlers');
const axios = require('axios');

class adsTxtManager extends Base {
    constructor(args) {
        super(args);
        this.config = args;
    }

    async execute({body}) {
        try {
            const {permission} = body.additional;
            let result = undefined;
            switch (permission) {
                case "canSeeWBidStatusAdsTxt":
                    result = await this.sendRequest(this.config);
                    break;
                case "canSeeAllWbidUsers":
                    result = await this.sendRequest(this.config);
                    break;
                case "canEditWBidPlacements":
                    result = await this.sendRequest(this.config);
                    break;
                case "canCreateWBidPlacements":
                    result = await this.sendRequest(this.config);
                    break;
                case "canSeeOwnWBidUsers":
                    result = await this.sendRequest(this.config);
                    break;
                default:
                    throw new ServerError('FORBIDDEN', 'FORBIDDEN');
            }
            return {
                success: true,
                result
            };
        } catch (err) {
            throw err;
        }
    }

    async sendRequest({options}) {
        return axios.request(options)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                console.error(`Something going wrong -> ${err}`);
                return err
            });
    }
}

module.exports = adsTxtManager;
