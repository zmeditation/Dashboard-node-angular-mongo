const Base = require( '../../Base' );
const { ServerError } = require('../../../handlers/errorHandlers');
const { bulkAddDeductions } = require( './helpers' );
const { ERRORS } = require('../../../constants/errors');

class BulkAddDeductionToPubl extends Base {
    async execute ({ body: { additional, query } }) {
        let successMsg, error;

        switch (additional.permission) {
            case 'canAddDeduction':
                ({ successMsg, error } = await bulkAddDeductions(query));
                break;
            default:
                throw new ServerError(
                    'You don\'t have permissions to process this action', 
                    ERRORS.FORBIDDEN
                );
        }
        
        return {
            success: true,
            successMsg,
            error
        };
    }
}

module.exports = BulkAddDeductionToPubl;