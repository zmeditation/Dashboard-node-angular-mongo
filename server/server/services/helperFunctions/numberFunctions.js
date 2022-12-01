const parseToNumber =  (n) => {
    return !isNaN(parseInt(n)) ? parseInt(n) : 0;
}

module.exports = {
    parseToNumber
}