// const {SSP} = require('./res/pg/models');
const sspList = require('./res/ssp.json');

class SspList {
    constructor() {
    }

    async run() {
        return {
            success: true,
            name: 'SSP',
            results: Object.entries(sspList)
        }
    }

/*    getSSPData = async () => {
        const SSPS = await SSP.findAll({attributes: ['id', 'name', 'enable']});
        return SSPS.map(ssp => ssp['dataValues'])
            .map(ssp => {
                return {
                    name: ssp.name.trim(),
                    enable: ssp.enable,
                    id: ssp.id
                }
            });
    }*/
}

module.exports = SspList;

