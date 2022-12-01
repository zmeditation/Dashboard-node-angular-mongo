import Validator from '../../../../../utils/validator';
import { ERRORS, ERROR_CODES } from '../../../../../constants/errors';
import { MiddlewareContract } from '../../../../../interfaces/middleware';
import { Request, Response } from '../../../../../interfaces/express';

export default class GetAMsByEditAllPubsPermissionRequest implements MiddlewareContract {
  private fields = {
    sort: 'sort',
    include: 'include'
  };

  public use(request: Request, response: Response, next: Function) {
    const errors = [];

    const { sort, include } = request.query;

    if (sort && !Validator.sort(sort)) {
      errors.push(this.fields.sort);
    }

    if (include && !Validator.includeGetParameter(include)) {
      errors.push(this.fields.include);
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
