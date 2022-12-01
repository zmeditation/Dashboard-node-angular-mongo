import Validator from '../../../../utils/validator';
import { ERRORS, ERROR_CODES } from '../../../../constants/errors';
import { ROLES_ARR as ROLES } from '../../../../constants/roles';
import { MiddlewareContract } from '../../../../interfaces/middleware';
import { Request, Response } from '../../../../interfaces/express';

export default class GetTestUsersRequest implements MiddlewareContract {
  private validationFields = {
    roles: 'roles'
  };

  public use(request: Request, response: Response, next: Function) {
    try {
      const errors = [];

      const { roles } = request.query;

      if (roles && !Validator.hasValuesInArray(roles.split(','), ROLES)) {
        errors.push(this.validationFields.roles);
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
