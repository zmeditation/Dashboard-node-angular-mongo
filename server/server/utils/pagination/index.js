/**
 * @format
 * @typedef {import("./types").SettingsMongoDB} SettingsMongoDB
 * @typedef {import("./types").ResultSettingsMongoDb} ResultSettingsMongoDb
 * @typedef {import("./types").SettingsBreakObjectIntoPages} SettingsBreakObjectIntoPages
 */

class Pagination {
  /**
   * @param {SettingsMongoDB} data
   * @returns {ResultSettingsMongoDb} settings
   */
  static getMongoDBSettings(data) {
    const result = {};

    result.page = data.page;
    result.limit = data.limit * data.step;
    result.startIndex = (data.page - 1) * data.limit;
    result.startIndex = data.indent ? result.startIndex + data.indent : result.startIndex;

    const countPages = Math.round(data.totalRows / data.limit);
    result.countPages = countPages ? countPages : 1;

    result.totalRows = data.totalRows;

    return result;
  }

  /**
   * @param {SettingsBreakObjectIntoPages} data
   * @returns {any[]}
   */
  static breakObjectIntoPages(data) {
    const result = [];
    const items = data.items;
    const countPages = data.countPages;
    const limit = data.limit;

    for (let i = 0; i < countPages; i++) {
      if (!items.length) {
        break;
      }

      const pageItems = [];

      for (let j = 0; j < limit; j++) {
        if (!items.length) {
          break;
        }

        pageItems.push(items.shift());
      }

      result.push(pageItems);
    }

    return result;
  }
}

module.exports = Pagination;
