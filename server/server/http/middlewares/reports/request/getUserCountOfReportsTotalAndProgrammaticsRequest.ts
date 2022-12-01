import Validator from '../../../../utils/validator';
import { ERRORS, ERROR_CODES } from '../../../../constants/errors';
import { MiddlewareContract } from '../../../../interfaces/middleware';
import { Request, Response } from '../../../../interfaces/express';

export default class GetUserRequest implements MiddlewareContract {
  private validationFields = {
    userId: 'userId'
  };

  public use(request: Request, response: Response, next: Function) {
    const errors = [];

    const { userId } = request.params;

    if (!Validator.mongoDBId(userId)) {
      errors.push(this.validationFields.userId);
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
