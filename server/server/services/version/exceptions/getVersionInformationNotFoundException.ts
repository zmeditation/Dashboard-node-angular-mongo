import { Objectable } from '../../../interfaces/objectable';

export default class GetVersionInformationNotFoundException extends Error implements Objectable {
  protected statusCode: number;

  public constructor() {
    super('Version not found');
    this.name = 'GetVersionInformationNotFoundException';
    this.statusCode = 404;
  }
  
  toObject() {
    return {
      status: this.statusCode,
      error: {
        message: this.message
      }
    };
  }
}

module.exports = GetVersionInformationNotFoundException;
