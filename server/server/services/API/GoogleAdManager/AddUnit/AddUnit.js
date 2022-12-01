const Base = require('../../../Base');
const GoogleAdManagerAPIAdUnit = require('../index.ts').default;
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const { handleErrors } = require('../../../helperFunctions/handleErrors');
const { FileService } = require('../../../helperFunctions/FileService');

class AdUnitAPI extends Base {
    constructor(args) {
        super(args);
    }

    async execute({ body: { additional: { permission }, adUnitParams } }) {
        try {
            if (permission) {
                let newUnit = undefined;

                switch (permission) {
                    case "canCreateNewAdUnit":
                        const createAddUnit = new GoogleAdManagerAPIAdUnit(new FileService());
                        newUnit = await createAddUnit.createAdUnit(adUnitParams);
                        break;
                    default:
                        throw { statusCode: 403, statusMessage: 'Permissions not valid.' };
                }

                return {
                    data: {
                        type: 'adUnit',
                        attributes: {
                            newUnit
                        }
                    } 
                }
            }
        } catch (error) {
            const customText = 'Error in AdUnitAPI';
      
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


module.exports = AdUnitAPI;
