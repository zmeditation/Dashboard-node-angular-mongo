const Base = require( '../../Base' );
const { ServerError } = require('../../../handlers/errorHandlers');
const { addDeductionToPubl } = require( './addDeductionSmall' );

class AddDeductionToPubl extends Base {
    constructor(args) {
        super(args);
    }

    async execute ( { body: { additional: { permission }, query } } ) {
        try {
            if (permission) {
                let successMsg, error;

                switch (permission) {
                    
                    case "canAddDeduction":
                        ({successMsg, error} = await addDeductionToPubl(query));
                        break;

                    default:
                        throw new ServerError('FORBIDDEN', 'FORBIDDEN');
                }
                
                return {
                    success: true,
                    successMsg,
                    error
                }
            }
        } catch (error) {
            console.log(error);
            throw new ServerError('ADD_DEDUCTION_ERROR', 'BAD_REQUEST')
        }
    }
}

module.exports = AddDeductionToPubl;