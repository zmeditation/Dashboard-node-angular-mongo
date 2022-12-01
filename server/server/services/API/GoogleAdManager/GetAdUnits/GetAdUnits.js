const Base = require( '../../../Base' );
const GoogleAdManagerAPIAdUnit = require('../index.ts').default;
const { helperToReadFile } = require('../../../helperFunctions/workWithFiles');
const { FileService } = require('../../../helperFunctions/FileService');
const { checkResponseOnError } = require('../../../../handlers/checkResponseOnError');
const { handleErrors } = require('../../../helperFunctions/handleErrors');


class GetAdUnits extends Base {
    constructor(args) {
        super(args);
    }
    
    async execute ({ body: { additional: { permission }, query: { queryType = 'FILE', parentId }}} ) {
        try {
            if (permission) {
                let resultOfAdUnits, error = undefined;

                switch (permission) {

                    case "canGetAdUnit":
                        if (queryType === 'FILE') {

                            const allAddUnitsFile = `${__dirname}/../adUnitsFiles/adUnitsNames.json`;
                            const { data: adUnits, error: readError } = await helperToReadFile(allAddUnitsFile);
                            resultOfAdUnits = JSON.parse(adUnits);
                            error = readError;
 
                        } else if (queryType === 'NEW AD UNITS') {
                            
                            const AdManager = new GoogleAdManagerAPIAdUnit(new FileService());
                            ({ resultOfAdUnits, error }  = await AdManager.getAllAdUnits(parentId));
                        }

                        break;
                    default:
                        throw { statusCode: 403, statusMessage: 'Permissions not valid.' };
                }

                if (error !== null) {
                    throw error;
                 }

                return {
                    success: true,
                    resultOfAdUnits,
                    error: null
                }
            }
        } catch (error) {
            const customText = 'Error in GetAdUnits';
      
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


module.exports = GetAdUnits;