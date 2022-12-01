const findValidString = (array = []) => {
    return array.find(el => (typeof el === 'string' && el.length));
}

module.exports = {
    findValidString
}