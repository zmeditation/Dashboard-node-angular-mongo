import { Objectable } from '../../../../interfaces/objectable';
import { ERRORS, ERROR_CODES } from '../../../../constants/errors';

export default class RemoveInCurrentAccountManagerPublisherMDBException extends Error implements Objectable {
  protected statusCode: number;

  public constructor(stack: string) {
    super(ERRORS.INTERNAL_SERVER_ERROR);
    this.name = 'RemoveInCurrentAccountManagerPublisherMDBException';
    this.statusCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
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

