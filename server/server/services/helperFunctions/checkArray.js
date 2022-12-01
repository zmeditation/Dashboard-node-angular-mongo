const isArrayAndLength = (arrayOfArray) => arrayOfArray.every((el) => Array.isArray(el) && el.length);

module.exports = { isArrayAndLength };