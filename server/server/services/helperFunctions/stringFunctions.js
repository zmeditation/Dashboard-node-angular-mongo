const isJson = (string) => {
    try {
        if (typeof string === 'string') {
            JSON.parse(string);
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

module.exports = {
    isJson
}