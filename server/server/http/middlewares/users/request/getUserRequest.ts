import Validator from '../../../../utils/validator';
import { ERRORS, ERROR_CODES } from '../../../../constants/errors';
import { QUERY_FIELDS_PARAM_KEYS } from '../../../../constants/users';
import { MiddlewareContract } from '../../../../interfaces/middleware';
import { Request, Response } from '../../../../interfaces/express';

export default class GetUserRequest implements MiddlewareContract {
  private validationFields = {
    id: 'id',
    fields: 'fields'
  };

  public use(request: Request, response: Response, next: Function) {
    const errors = [];

    const { id } = request.params;
    const {
      fields
    } = request.query;

    if (!Validator.mongoDBId(id)) {
      errors.push(this.validationFields.id);
    }

    if (fields && !Validator.hasValuesInArray(fields.split(','), QUERY_FIELDS_PARAM_KEYS)) {
      errors.push(this.validationFields.fields);
    }

    if (errors.length) {
      return response.status(ERROR_CODES.VALIDATION_FAIL).send(JSON.stringify({
        status: ERROR_CODES.VALIDATION_FAIL,
        error: {
          message: ERRORS.VALIDATION_FAIL,
          fields: errors
        }
      }));
    }

    next();
  }
}
