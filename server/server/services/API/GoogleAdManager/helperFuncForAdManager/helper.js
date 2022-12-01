const { helperToWriteFile, isExistDirOrFile, isExist } = require('../../../helperFunctions/workWithFiles');

const writeFile = async (path, data) => {
    try {
        const existPath = await isExist(path);

        if (!existPath) {
            const {error, whatCreatedInfo} = await isExistDirOrFile(path);
            if (error !== null) {
                return {error}
            }

            const isWriteFile = whatCreatedInfo.some(obj => obj.created === 'file');
            if (isWriteFile === true) {
                return helperToWriteFile(path, data);
            }
            return {error: {msg: 'Created only folders.', path}};
        }

        return helperToWriteFile(path, data);
    } catch (error) {
        const errorMsg = error && error.msg ? error : {error: {msg: 'Error write file.', path}};

        console.log(errorMsg);
        return errorMsg;
    }
}


const toCollectAdUnit = (parameters) => {
    try {
        let { 
            configname, 
            width, 
            height, 
            targetWindow = 'BLANK', 
            environmentType = 'BROWSER', 
            isFluid = false, 
            parentId = "111081962" 
        } = parameters;

        if (isFluid) { // if banner is fluid, create ad unit with 1x1 sizes
            width = 1;
            height = 1;
        }
        return {
            adUnits: [
                {
                    parentId,
                    name: configname,
                    targetWindow,
                    adUnitCode: configname,
                    adUnitSizes: [
                        {
                            size: {
                                width,
                                height
                            },
                            environmentType,
                            fullDisplayString: `${width}x${height}`
                        }
                    ],
                    isFluid
                }
            ]
        };
    } catch (error) {
            console.error(error);
    }
}

module.exports = {
    writeFile,
    toCollectAdUnit
}
