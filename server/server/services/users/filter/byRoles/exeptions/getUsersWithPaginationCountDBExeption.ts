import { Objectable } from '../../../../../interfaces/objectable';
import { ERRORS, ERROR_CODES } from '../../../../../constants/errors';

export default class GetUsersWithPaginationCountDBException extends Error implements Objectable {
  protected statusCode: number;

  public constructor(stack: string) {
    super(ERRORS.INTERNAL_SERVER_ERROR);
    this.name = 'GetUsersWithPaginationCountDBException';
    this.statusCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
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
