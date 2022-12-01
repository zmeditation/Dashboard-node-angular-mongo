const Base = require('../../../../services/Base');
const {ServerError} = require('../../../../handlers/errorHandlers');
const TagGenerator = require('./TagGenerator');

class Tac extends Base {
    constructor(args) {
        super(args);
    }

    async execute({body}) {
        try {
            if (body && body['query']) {
                const code = await TagGenerator(body.query);
                if (code['success'] === true) {
                    return {success: true, results: code['res']};
                } else {
                    throw new ServerError(code['error']);
                }
            } else throw new ServerError('Incorrect request', 'BAD_REQUEST');
        } catch (e) {
            console.log(e);
            throw new ServerError();
        }
    }
}

module.exports = Tac;
