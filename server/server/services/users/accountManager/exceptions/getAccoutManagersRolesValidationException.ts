import { Objectable } from '../../../../interfaces/objectable';
import { ERROR_CODES } from '../../../../constants/errors';

export default class GetAccoutManagersRolesValidationException extends Error implements Objectable {
  protected statusCode: number;
  protected fields: string[]|readonly string[];

  public constructor(fields: string[]|readonly string[]) {
    super('Validation roles error');
    this.name = 'GetAccoutManagersRolesValidationException';
    this.statusCode = ERROR_CODES.VALIDATION_FAIL;
    this.fields = fields;
  }

  toObject() {
    return {
      status: this.statusCode,
      error: {
        message: this.message,
        fields: this.fields
      }
    };
  }
}
