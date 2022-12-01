import { ERROR_CODES, ERRORS } from '../../../constants/errors';
import { CountReportsContract } from '../../../services/reporting/countReports/interfaces';
import { Objectable } from '../../../interfaces/objectable';
import { Request, Response } from '../../../interfaces/express';

export default class CountReportsController {
  private countReportsService: CountReportsContract;

  public constructor(
    countReportsService: CountReportsContract
  ) {
    this.countReportsService = countReportsService;
  }

  public async getUserCountOfReportsTotalAndProgrammatics(request: Request, response: Response) {
    let result: any;
    let statusCode = 200;
    const { userId } = request.params;

    try {
      result = await this.countReportsService.getUserCountOfReportsTotalAndByProgrammatics(userId);
      result = {
        status: statusCode,
        data: result
      };
    } catch(error: any) {
      statusCode = error.statusCode;
      result = this._getErrorResponse(error);
    }

    return response.status(statusCode).send(JSON.stringify(result));
  }

  private _getErrorResponse(error: Objectable | any): any {
    console.error(error);

    // check not exception error
    const errorData = error.toObject ? error.toObject() : {
      status: ERROR_CODES.INTERNAL_SERVER_ERROR,
      error: {
        message: ERRORS.INTERNAL_SERVER_ERROR
      }
    };

    return errorData;
  }
}
