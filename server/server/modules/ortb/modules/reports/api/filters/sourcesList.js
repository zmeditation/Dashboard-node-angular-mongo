class SourcesList {
    constructor(){ }

    run() {
        const result = ['app', 'site'];
        return {
            success: true,
            name: 'SOURCES',
            results: result,
        }
    }
}

module.exports = SourcesList;
