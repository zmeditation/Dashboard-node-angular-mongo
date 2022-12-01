import VersionModel from '../../../database/mongoDB/migrations/VersionModel';
import { ERRORS, ERROR_CODES } from '../../../constants/errors';
import { MiddlewareContract } from '../../../interfaces/middleware';
import { Request, Response } from '../../../interfaces/express';

export default class CheckVersionExistMiddleware implements MiddlewareContract {
  private fields = ['version'];

  public async use(request: Request, response: Response, next: Function) {
    try {
      const version = request.body.params.version;
      let result;

      try {
        result = await VersionModel.findOne({ version }).exec();
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

      if (result) {
        return response.status(ERROR_CODES.CONFLICT).send(JSON.stringify({
          status: ERROR_CODES.CONFLICT,
          error: {
            message: `Version ${version} already exist`,
            fields: this.fields
          }
        }));
      }

      next();
    } catch (error) {
      console.error(error);
      return response.status(ERROR_CODES.INTERNAL_SERVER_ERROR).send(
        JSON.stringify({
          status: ERROR_CODES.INTERNAL_SERVER_ERROR,
          error: {
            message: ERRORS.INTERNAL_SERVER_ERROR,
          }
        })
      );
    }
  }
}
