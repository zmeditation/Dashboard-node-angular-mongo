import { Objectable } from '../../../../interfaces/objectable';

export default class GetTestUserException extends Error implements Objectable {
  protected statusCode: number;

  public constructor(stack: string) {
    super('Internal Server Error');
    this.name = 'GetTestUserException';
    this.statusCode = 500;
    this.stack = stack;
  }
  
  public toObject() {
    return {
      status: this.statusCode,
      error: {
        message: this.message
      }
    };
  }
}