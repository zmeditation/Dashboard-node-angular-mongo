import Validator from '../../../../utils/validator';
import { ERRORS, ERROR_CODES } from '../../../../constants/errors';
import { MiddlewareContract } from '../../../../interfaces/middleware';
import { Request, Response } from '../../../../interfaces/express';

export default class CreateUserRequest implements MiddlewareContract {
  private validationFields = {
    name: 'name',
    email: 'email',
    phone: 'phone',
    address: 'address',
    birthday: 'birthday',
    company: 'company',
    password: 'password',
    password_confirm: 'password_confirm',
    commission_number: 'commission_number',
    commission_type: 'commission_type',
    isTest: 'isTest'
  };

  public use(request: Request, response: Response, next: Function) {
    try {
      const errors = [];

      const { name, email, additional, password, password_confirm, commission, isTest } = request.body.userObject;

      if (!Validator.min(name, 1) || !Validator.max(name, 50)) {
        errors.push(this.validationFields.name);
      }

      if (!Validator.email(email)) {
        errors.push(this.validationFields.email);
      }

      if (password && password_confirm) {
        if (!Validator.min(password, 1)) {
          errors.push(this.validationFields.password);
        }

        if (!Validator.min(password_confirm, 1)) {
          errors.push(this.validationFields.password_confirm);
        }

        if (!errors.includes(this.validationFields.password) && !errors.includes(this.validationFields.password_confirm)) {
          if (password !== password_confirm) {
            errors.push('Passwords do not match');
          }
        }
      }

      if (isTest !== undefined && !Validator.isBoolean(isTest)) {
        errors.push(this.validationFields.isTest);
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