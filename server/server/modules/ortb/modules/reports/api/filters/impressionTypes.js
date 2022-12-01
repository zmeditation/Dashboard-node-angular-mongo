class ImpTypesList {
    constructor(){ }

    run() {
        const result = ['banner', 'video', 'native'];
        return {
            success: true,
            name: 'IMPRESSION_TYPES',
            results: result,
        }
    }
}

module.exports = ImpTypesList;
