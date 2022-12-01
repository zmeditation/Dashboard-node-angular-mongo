
const Base = require( '../../../Base' );
const WritingAdUnitsInfoSmall = require('./writingAdUnitInfoSmall');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const { handleErrors } = require('../../../helperFunctions/handleErrors');

class WritingAdUnitsInfo extends Base {
    constructor(args) {
        super(args);
    }
    
    async execute ( { body: { additional: { permission }}} ) {
        try {
    
            if (permission) {
                
                let arrayOfParams, error = undefined;

                switch (permission) {

                    case "canCreateNewAdUnit":
                        const write = new WritingAdUnitsInfoSmall();
                        ({ arrayOfParams, error } = await write.writeAdUnitNames());
                        break;

                    default:
                        throw { statusCode: 403, statusMessage: 'Permissions not valid.' };
                }

                if (error !== null) {
                   throw error;
                }

                return {
                    success: true,
                    arrayOfParams,
                    error: null
                }
            }
        } catch (error) {
            const customText = 'Error in WritingAdUnitsInfo';
      
            handleErrors(error, customText);
            await checkResponseOnError({ 
                response: error?.statusCode && error, 
                error, 
                customText, 
                runNext: false 
            });
        }
    }
}


module.exports = WritingAdUnitsInfo;