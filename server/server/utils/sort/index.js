/** @format */

class Sort {
  /**
   * Value should be like email:asc|enabled.status:desc
   *
   * @param {string} value
   * @returns {object}
   */
  static queryStringToMongoDBObject(value) {
    const result = {};
    const fieldsRules = value.split('|');

    for (let i = 0; i < fieldsRules.length; i++) {
      const splitFieldRule = fieldsRules[i].split(':');
      let field = splitFieldRule[0];
      const sort = splitFieldRule[1] === 'asc' ? 1 : -1;

      result[field] = sort;
    }

    return result;
  }
}

module.exports = Sort;
