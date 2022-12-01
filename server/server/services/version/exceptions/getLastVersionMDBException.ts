import { Objectable } from '../../../interfaces/objectable';

export default class GetLastVersionMDBException extends Error implements Objectable {
  protected statusCode: number;

  public constructor(stack: string) {
    super('Internal Server Error');
    this.name = 'GetLastVersionMDBException';
    this.statusCode = 500;
    this.stack = stack;
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

module.exports = GetLastVersionMDBException;
