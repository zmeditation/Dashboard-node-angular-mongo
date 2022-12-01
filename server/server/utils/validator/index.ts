import { KeyValueExtraValueObject } from '../../types/object';

const keyValueExtraValueObjectValidationRules = {
  key: [
    'string'
  ],
  value: [
    'string',
    'number',
    'boolean'
  ],
  extraValue: [
    'string',
    'number',
    'boolean'
  ]
}

export default class Validator {
  public static arrayEqualsValues(arr: any[]| readonly any[], valuesArr: any[]|readonly any[]): boolean {
    for (const element of arr) {
      if (!valuesArr.includes(element)) {
        return false;
      }
    }

    return true;
  }

  public static sort(value: string): boolean {
    if (!this.isString(value)) {
      return false;
    }

    const rules = value.split('|');
    const regularExpression = /^[a-z][a-z_.]*[a-z]:(asc|desc)$/;

    for (const rule of rules) {
      if (!regularExpression.test(rule)) {
        return false;
      }
    }

    return true;
  }

  public static includeGetParameter(value: string | KeyValueExtraValueObject[] | any): boolean {
    try {
      value = this.isString(value) ? JSON.parse(value) : value;

      for (const obj of value) {
        for (let key in obj) {
          // @ts-ignore
          const validationRules = keyValueExtraValueObjectValidationRules[key];

          if (!validationRules) {
            return false;
          }

          if (!validationRules.includes(typeof obj[key])) {
            return false; }
        }
      }
    } catch (error) {
      console.error(error);
      return false;
    }

    return true;
  }

  public static mongoDBId(value: string): boolean {
    if (!this.isString(value)) {
      return false;
    }

    return /^[a-z0-9]{24}$/.test(value);
  }

  public static version(value: string): boolean {
    if (!this.isString(value)) {
      return false;
    }

    return /^[0-9\.A-z]+$/.test(value);
  }

  public static isNaN(value: any): boolean {
    return isNaN(value);
  }

  public static isNumber(value: any): boolean {
    if (this.isString(value)) {
      value = parseFloat(value);
    }

    if (typeof value === 'number' && !this.isNaN(value)) {
      return true;
    }

    return false;
  }

  public static isString(value: any): boolean {
    return typeof value === 'string';
  }

  public static isObject(value: any): boolean {
    return typeof value === 'object';
  }

  public static isNull(value: any) {
    return value === null;
  }

  public static isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  public static hasKeyInObject(key: string, obj: object|any): boolean {
    if (!this.isString(key)) {
      return false;
    }

    return obj.hasOwnProperty(key);
  }

  public static hasValuesInArray(values: (string|number|boolean)[], arr: (string|number|boolean)[] | readonly (string|number|boolean)[]): boolean {
    if (!Array.isArray(values) || !Array.isArray(arr)) {
      return false;
    }

    for (const value of values) {
      if (!this.hasValueInArray(value, arr)) {
        return false;
      }
    }

    return true;
  }

  public static min(value: string, min: number): boolean {
    if (!this.isString(value)) {
      return false;
    }

    return value.length >= min;
  }

  public static max(value: string, max: number): boolean {
    if (!this.isString(value)) {
      return false;
    }

    return value.length <= max;
  }

  public static hasValueInArray(value: string|number|boolean, arr: (string|number|boolean)[] | readonly (string|number|boolean)[]): boolean {
    return arr.includes(value);
  }

  public static email(value: string): boolean {
    if (!this.isString(value)) {
      return false;
    }

    return /\S+@\S+\.\S+/.test(value);
  }
}
