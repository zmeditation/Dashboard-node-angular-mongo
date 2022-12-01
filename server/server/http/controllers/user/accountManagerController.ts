import { ERROR_CODES, ERRORS } from '../../../constants/errors';
import { AccountManagerContract } from '../../../services/users/accountManager/interfaces';
import { Request, Response } from '../../../interfaces/express';
import { Objectable } from '../../../interfaces/objectable';

export default class AccountManagerController {
  protected accountManagerService: AccountManagerContract;

  public constructor(accountManagerService: AccountManagerContract) {
    this.accountManagerService = accountManagerService;
  }

  public async bindAccountManagerToPublisher(request: Request, response: Response): Promise<void> {
    try {
      let result: any | never = undefined;
      let statusCode = 204;
      const { newAccountManagerId, publisherId, currentAccountManagerId } = request.body;

      try {
        await this.accountManagerService.bindPublisherToAccountManager({
          publisherId,
          newAccountManagerId,
          currentAccountManagerId
        });
      } catch (error: any) {
        statusCode = error.statusCode;
        result = AccountManagerController._getErrorResponse(error);
      }

      response.status(statusCode).send(JSON.stringify(result));
    } catch (error) {
      const errorResult: any = AccountManagerController._getErrorResponse(error);
      response.status(errorResult.status).send(JSON.stringify(errorResult));
    }
  }

  private static _getErrorResponse(error: Objectable | any): any {
    console.error(error);

    // check not exception error
    return error.toObject
      ? error.toObject()
      : {
        status: ERROR_CODES.INTERNAL_SERVER_ERROR,
        error: {
          message: ERRORS.INTERNAL_SERVER_ERROR
        }
      };
  }
}
