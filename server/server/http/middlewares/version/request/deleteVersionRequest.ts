import Validator from '../../../../utils/validator';
import { ERRORS, ERROR_CODES } from '../../../../constants/errors';
import { MiddlewareContract } from '../../../../interfaces/middleware';
import { Request, Response } from '../../../../interfaces/express';

export default class DeleteVersionRequest implements MiddlewareContract {
  private fields = {
    version: 'version',
    releaseDate: 'releaseDate',
    description: 'description'
  };

  public use(request: Request, response: Response, next: Function) {
    try {
      const errors = [];
      const version = request.query.value;

      if (!Validator.version(version)) {
        errors.push(this.fields.version);
      }

      if (errors.length) {
        return response.status(ERROR_CODES.VALIDATION_FAIL).send(
          JSON.stringify({
            status: ERROR_CODES.VALIDATION_FAIL,
            error: {
              message: ERRORS.VALIDATION_FAIL,
              fields: errors
            }
          })
        );
      }

      next();
    } catch (error) {
      console.error(error);
      return response.status(ERROR_CODES.INTERNAL_SERVER_ERROR).send(
        JSON.stringify({
          status: ERROR_CODES.INTERNAL_SERVER_ERROR,
          error: {
            message: ERRORS.INTERNAL_SERVER_ERROR
          }
        })
      );
    }
  }
}
