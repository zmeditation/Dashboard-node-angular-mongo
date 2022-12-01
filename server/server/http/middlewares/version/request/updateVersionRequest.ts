import Validator from '../../../../utils/validator';
import { ERRORS, ERROR_CODES } from '../../../../constants/errors';
import { MiddlewareContract } from '../../../../interfaces/middleware';
import { Request, Response } from '../../../../interfaces/express';

export default class UpdateVersionRequest implements MiddlewareContract {
  private fields = {
    lastVersion: 'lastVersion',
    newVersion: 'newVersion',
    releaseDate: 'releaseDate',
    description: 'description'
  };

  public use(request: Request, response: Response, next: Function) {
    try {
      const errors = [];

      const { lastVersion, newVersion, releaseDate, description } = request.body.params;

      if (!Validator.version(lastVersion)) {
        errors.push(this.fields.lastVersion);
      }

      if (!Validator.version(newVersion)) {
        errors.push(this.fields.newVersion);
      }

      if (Validator.isNaN(Date.parse(releaseDate))) {
        errors.push(this.fields.releaseDate);
      }

      if (!Validator.isObject(description) || !Validator.isString(description.in) || Validator.isString(description.in) && !Validator.min(description.in, 1)) {
        errors.push(this.fields.description);
      }

      if (!errors.includes(this.fields.description)) {
        if (!Validator.isNull(description.out) && !Validator.isString(description.out) || Validator.isString(description.out) && !Validator.min(description.out, 1)) {
          errors.push(this.fields.description);
        }
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
