import { model } from 'mongoose';
import { ERRORS, ERROR_CODES } from '../../../../constants/errors';
import { MiddlewareContract } from '../../../../interfaces/middleware';
import { Request, Response } from '../../../../interfaces/express';

const User = model('User');

export default class CheckCurrentAMExistBindAMToPubMiddleware implements MiddlewareContract {
  private fields = ['currentAccountManagerId'];

  public async use(request: Request, response: Response, next: Function) {
    const { currentAccountManagerId } = request.body;

    if (!currentAccountManagerId) {
      return next();
    }

    let accountManager;

    try {
      accountManager = await User.findById(currentAccountManagerId);
    } catch (error) {
      console.error(error);
      return response.status(ERROR_CODES.INTERNAL_SERVER_ERROR).send(JSON.stringify({
        status: ERROR_CODES.INTERNAL_SERVER_ERROR,
        error: {
          message: ERRORS.INTERNAL_SERVER_ERROR,
          fields: this.fields
        }
      }));
    }

    if (!accountManager) {
      return response.status(ERROR_CODES.NOT_FOUND).send(JSON.stringify({
        status: ERROR_CODES.NOT_FOUND,
        error: {
          message: 'ACCOUNT_MANAGER_NOT_FOUND',
          fields: this.fields
        }
      }));
    }

    next();
  }
}
