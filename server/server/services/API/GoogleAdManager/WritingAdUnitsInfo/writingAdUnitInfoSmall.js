const { writeFile } = require('fs').promises;
const GoogleAdManagerAPIAdUnit = require('../index.ts').default;
const { FileService } = require('../../../helperFunctions/FileService');


class WritingAdUnitsInfoSmall extends GoogleAdManagerAPIAdUnit {
    constructor() {
        super(new FileService());

        this.defaultAtUnitFilePath = `${__dirname}/../adUnitsFiles/adUnitsNames.json`;
    }

    async writeAdUnitNames(adUnitFilePath = this.defaultAtUnitFilePath ) {
        const { resultOfAdUnits, error: geError} = await this.getAllAdUnits();
        if (geError !== null) return { geError };

        const arrayOfParams = await this.buildArrayOfParam(resultOfAdUnits, 'adUnitCode');
        if (!Array.isArray(arrayOfParams)) { return { error: { msg: 'Error to build array of Ad Units parameter.'}}};
        
        const data = JSON.stringify(arrayOfParams);
        await writeFile(adUnitFilePath, data);

        return {
            arrayOfParams,
            error: null
        }
    }

    buildArrayOfParam(array, byParam) {
        return new Promise( (resolve) => {
            const arrayOfParams = [];

            array.forEach( (obj, i, arr) => {
                if (obj[byParam] !== undefined && obj[byParam] !== null) { arrayOfParams.push(obj[byParam]) }
                if (arr.length -1 === i) { resolve(arrayOfParams) }
            });
        }); 
    }
}

module.exports = WritingAdUnitsInfoSmall;