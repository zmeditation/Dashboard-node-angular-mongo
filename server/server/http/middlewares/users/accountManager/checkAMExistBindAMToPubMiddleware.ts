import { model } from 'mongoose';
import { ERRORS, ERROR_CODES } from '../../../../constants/errors';
import { MiddlewareContract } from '../../../../interfaces/middleware';
import { Request, Response } from '../../../../interfaces/express';

const User = model('User');

export default class CheckAMExistBindAMToPubMiddleware implements MiddlewareContract {
  private fields = ['newAccountManagerId'];

  public async use(request: Request, response: Response, next: Function) {
    const { newAccountManagerId } = request.body;
    let accountManager;

    try {
      accountManager = await User.findById(newAccountManagerId);
    } catch (error) {
      console.error(error);
      return response.status(ERROR_CODES.INTERNAL_SERVER_ERROR).send(
        JSON.stringify({
          status: ERROR_CODES.INTERNAL_SERVER_ERROR,
          error: {
            message: ERRORS.INTERNAL_SERVER_ERROR,
            fields: this.fields
          }
        })
      );
    }

    if (!accountManager) {
      return response.status(ERROR_CODES.NOT_FOUND).send(
        JSON.stringify({
          status: ERROR_CODES.NOT_FOUND,
          error: {
            message: 'ACCOUNT_MANAGER_NOT_FOUND',
            fields: this.fields
          }
        })
      );
    }

    next();
  }
}
