import Validator from '../../../../utils/validator';
import { ERRORS, ERROR_CODES } from '../../../../constants/errors';
import { MiddlewareContract } from '../../../../interfaces/middleware';
import { Request, Response } from '../../../../interfaces/express';

export default class UpdatePublisherAccountManagerUpdateReportsRequest implements MiddlewareContract {
  private validationFields = {
    publisherId: 'publisherId'
  };

  public use(request: Request, response: Response, next: Function) {
    const errors = [];

    const { publisherId } = request.params;

    if (!Validator.mongoDBId(publisherId)) {
      errors.push(this.validationFields.publisherId);
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
