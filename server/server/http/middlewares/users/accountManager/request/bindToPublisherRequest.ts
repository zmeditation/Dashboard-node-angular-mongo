import Validator from '../../../../../utils/validator';
import { ERRORS, ERROR_CODES } from '../../../../../constants/errors';
import { MiddlewareContract } from '../../../../../interfaces/middleware';
import { Request, Response } from '../../../../../interfaces/express';

export default class BindToPublisherRequest implements MiddlewareContract {
  private fields = {
    newAccountManagerId: 'newAccountManagerId',
    publisherId: 'publisherId',
    currentAccountManagerId: 'currentAccountManagerId'
  };

  public use(request: Request, response: Response, next: Function) {
    const errors = [];

    const { newAccountManagerId, publisherId, currentAccountManagerId } = request.body;

    if (!Validator.mongoDBId(newAccountManagerId)) {
      errors.push(this.fields.newAccountManagerId);
    }

    if (!Validator.mongoDBId(publisherId)) {
      errors.push(this.fields.publisherId);
    }

    if (currentAccountManagerId && !Validator.mongoDBId(currentAccountManagerId)) {
      errors.push(this.fields.currentAccountManagerId);
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
