class AdTypeConfig {
    constructor() {

    }
    run() {
        return {
            success: true,
            name: 'AD_TYPE',
            results: [
                'banner',
                'inBannerVideo',
                'video'
            ]
        }
    }
}

module.exports = AdTypeConfig;
