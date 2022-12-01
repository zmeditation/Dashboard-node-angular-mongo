const renameKeysInArray = async(arrayOfObjects, newKey, oldKey) => {
    return arrayOfObjects.map((obj) => {
        return {[newKey]: obj[oldKey]}
    })
}

module.exports = renameKeysInArray;