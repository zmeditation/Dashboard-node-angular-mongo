const {SSP} = require('./res/pg/models');


class SspPubIdList {
    constructor() {
    }

    async run() {
        return {
            success: true,
            name: 'PUBLISHERS',
            results: await this.getSSPList()
        }
    }

    getSSPList = async () => {
        const list = await SSP.findAll();
        return list.map(ssp => {
            return {id: ssp.id.toString(), name: ssp.name}
        })
    }
}

module.exports = SspPubIdList;



