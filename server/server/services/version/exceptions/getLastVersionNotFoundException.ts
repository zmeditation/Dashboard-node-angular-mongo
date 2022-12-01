import { Objectable } from '../../../interfaces/objectable';

export default class GetLastVersionNotFoundException extends Error implements Objectable {
  protected statusCode: number;

  public constructor() {
    super('No dashboard versions available');
    this.name = 'GetLastVersionNotFoundException';
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

module.exports = GetLastVersionNotFoundException;
