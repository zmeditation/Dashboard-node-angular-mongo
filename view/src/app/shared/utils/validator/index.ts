export default class Validator {
  public static mongoDBId(value: string): boolean {
    if (!this.isString(value)) {
      return false;
    }

    return /^[a-z0-9]{24}$/.test(value);
  }

  public static isString(value: any): boolean {
    if (typeof value === 'string') {
      return true;
    }

    return false;
  }
}
