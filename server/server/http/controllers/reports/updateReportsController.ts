import { ERROR_CODES, ERRORS } from '../../../constants/errors';
import { PubAMUpdateReportsContract } from '../../../services/reporting/update/pubAMUpdate/interfaces';
import { Objectable } from '../../../interfaces/objectable';
import { Request, Response } from '../../../interfaces/express';

export default class UpdateReportsController {
  private pubAMUpdateReportsService: PubAMUpdateReportsContract;

  public constructor(pubAMUpdateReportsService: PubAMUpdateReportsContract) {
    this.pubAMUpdateReportsService = pubAMUpdateReportsService;
  }

  public async updatePubAM(request: Request, response: Response) {
    let statusCode = 200;
    let result: any;
    const { publisherId } = request.params;

    try {
      this.asyncUpdatePubAM(publisherId, request.body.additional.id);

      result = {
        status: statusCode,
        data: {
          message: 'REPORTS_UPDATING'
        }
      };
    } catch (error: any) {
      result = this._getErrorResponse(error);
      statusCode = result.status;
    }

    return response.status(statusCode).send(JSON.stringify(result));
  }

  private async asyncUpdatePubAM(publisherId: string, notificationUserId: string): Promise<void> {
    try {
      for await (let value of this.pubAMUpdateReportsService.update(publisherId)) {
        if (value.completed) {
          const notificationData = {
            message: {
              event: 'notifications',
              usersId: [notificationUserId],
              msg: {
                event: 'reports',
                text: 'UPDATED_PUB_AM_REPORTS',
                data: {
                  name: value.data.pubName
                }
              },
              msgType: 'userNf'
            },
            eventHandler: 'send_personal_notice'
          };

          process?.send && process.send(notificationData);
        }
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  private _getErrorResponse(error: Objectable | any): any {
    console.error(error);

    // check not exception error
    const errorData = error.toObject
      ? error.toObject()
      : {
          status: ERROR_CODES.INTERNAL_SERVER_ERROR,
          error: {
            message: ERRORS.INTERNAL_SERVER_ERROR
          }
        };

    return errorData;
  }
}
