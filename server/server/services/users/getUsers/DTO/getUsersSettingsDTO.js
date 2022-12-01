/**
 * @typedef {import("../types").GetUsesSettings} GetUsesSettings
 * @typedef {import("../../../../types/object").KeyValueExtraValueObject} KeyValueExtraValueObject
 */

class GetUsersSettingsDTO {
  constructor() {
    this._roles = [];
    this._search = '';
    this._page = 0;
    this._limit = 0;
    this._step = 0;
    this._sort = '';
    this._noRef = '';
    this._include = [];
    this._indent = 0;
    this._userTokenId = '';
    this._fields = [];
  }

  /**
   * @param {Array<string>} value
   */
  set roles(value) {
    this._roles = value;
  }

  /**
   * @param {string} value
   */
  set search(value) {
    this._search = value;
  }

  /**
   * @param {number} value
   */
  set page(value) {
    this._page = value;
  }

  /**
   * @param {number} value
   */
  set limit(value) {
    this._limit = value;
  }

  /**
   * @param {number} value
   */
  set step(value) {
    this._step = value;
  }

  /**
   * @param {string} value
   */
  set sort(value) {
    this._sort = value;
  }

  /**
   * @param {string} value
   */
  set noRef(value) {
    this._noRef = value;
  }

  /**
   * @param {KeyValueExtraValueObject[]} value
   */
  set include(value) {
    this._include = value;
  }

  /**
   * @param {number} value
   */
  set indent(value) {
    this._indent = value;
  }

  /**
   * @param {string|number} value
   */
  set userTokenId(value) {
    this._userTokenId = value;
  }

  /**
   * @param {string[]} value
   */
  set fields(value) {
    this._fields = value;
  }

  /**
   * @returns {GetUsesSettings}
   */
  toObject() {
    return {
      roles: this._roles,
      search: this._search,
      page: this._page,
      limit: this._limit,
      step: this._step,
      sort: this._sort,
      noRef: this._noRef,
      include: this._include,
      indent: this._indent,
      userTokenId: this._userTokenId,
      fields: this._fields
    };
  }
}

module.exports = GetUsersSettingsDTO;
