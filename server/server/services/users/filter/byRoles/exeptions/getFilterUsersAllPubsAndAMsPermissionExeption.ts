import { Objectable } from '../../../../../interfaces/objectable';
import { ERRORS, ERROR_CODES } from '../../../../../constants/errors';

export default class GetFilterUsersAllPubsAndAMsPermissionExeption extends Error implements Objectable {
  protected statusCode: number;

  public constructor() {
    super(ERRORS.FORBIDDEN);
    this.name = 'GetFilterUsersAllPubsAndAMsPermissionExeption';
    this.statusCode = ERROR_CODES.FORBIDDEN;
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