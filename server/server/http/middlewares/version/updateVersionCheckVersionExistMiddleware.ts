import VersionModel from '../../../database/mongoDB/migrations/VersionModel';
import { ERRORS, ERROR_CODES } from '../../../constants/errors';
import { MiddlewareContract } from '../../../interfaces/middleware';
import { Request, Response } from '../../../interfaces/express';

export default class UpdateVersionCheckVersionExistMiddleware implements MiddlewareContract {
  private fields = ['lastVersion'];

  public async use(request: Request, response: Response, next: Function) {
    try {
      const version = request.body.params.lastVersion;
      let result;

      try {
        result = await VersionModel.findOne({ version }).exec();
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

      if (!result) {
        return response.status(ERROR_CODES.NOT_FOUND).send(
          JSON.stringify({
            status: ERROR_CODES.NOT_FOUND,
            error: {
              message: `Update version ${version} is not exist`,
              fields: this.fields
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
