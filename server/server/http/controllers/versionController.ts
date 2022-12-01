import { ERROR_CODES, ERRORS } from '../../constants/errors';
import { VersionContract } from '../../services/version/interfaces';
import { Request, Response } from '../../interfaces/express';
import { Objectable } from '../../interfaces/objectable';

export default class VersionController {
  protected versionService: VersionContract;

  public constructor(versionService: VersionContract) {
    this.versionService = versionService;
  }

  public async getLastVersion(_request: Request, response: Response): Promise<void> {
    try {
      let result: any;
      let statusCode = 200;

      try {
        const lastVersion = await this.versionService.getLastVersion();
        result = {
          status: statusCode,
          data: lastVersion
        };
      } catch (error: any) {
        statusCode = error.statusCode;
        result = this._getErrorResponse(error);
      }

      response.status(statusCode).send(JSON.stringify(result));
    } catch (error: any) {
      const errorResult = this._getErrorResponse(error);
      response.status(errorResult.status).send(JSON.stringify(errorResult));
    }
  }

  public async getVersionsList(request: Request, response: Response): Promise<void> {
    try {
      let result: any;
      let statusCode = 200;
      const { userRole } = request.query;

      try {
        const versionList = await this.versionService.getVersionList(userRole);
        result = {
          status: statusCode,
          data: versionList
        };
      } catch (error: any) {
        statusCode = error.statusCode;
        result = this._getErrorResponse(error);
      }

      response.status(statusCode).send(JSON.stringify(result));
    } catch (error: any) {
      const errorResult = this._getErrorResponse(error);
      response.status(errorResult.status).send(JSON.stringify(errorResult));
    }
  }

  public async getVersionInformation(request: Request, response: Response): Promise<void> {
    try {
      let result: any;
      let statusCode = 200;
      const { version, userRole } = request.query;

      try {
        const versionInformation = await this.versionService.getVersionInformation({
          version,
          userRole
        });
        result = {
          status: statusCode,
          data: versionInformation
        };
      } catch (error: any) {
        statusCode = error.statusCode;
        result = this._getErrorResponse(error);
      }

      response.status(statusCode).send(JSON.stringify(result));
    } catch (error: any) {
      const errorResult = this._getErrorResponse(error);
      response.status(errorResult.status).send(JSON.stringify(errorResult));
    }
  }

  public async createVersion(request: Request, response: Response): Promise<void> {
    try {
      let result: any;
      let statusCode = 200;
      const data = {
        version: request.body.params.version,
        releaseDate: request.body.params.releaseDate,
        description: request.body.params.description
      };

      try {
        const createData = await this.versionService.createVersion(data);
        result = {
          status: statusCode,
          data: createData
        };
      } catch (error: any) {
        statusCode = error.statusCode;
        result = this._getErrorResponse(error);
      }

      response.status(statusCode).send(JSON.stringify(result));
    } catch (error: any) {
      const errorResult = this._getErrorResponse(error);
      response.status(errorResult.status).send(JSON.stringify(errorResult));
    }
  }

  public async updateVersion(request: Request, response: Response): Promise<void> {
    try {
      let result: any;
      let statusCode = 200;

      const data = {
        lastVersion: request.body.params.lastVersion,
        newVersion: request.body.params.newVersion,
        releaseDate: request.body.params.releaseDate,
        description: request.body.params.description
      };

      try {
        const updatedData = await this.versionService.updateVersion(data);
        result = {
          status: statusCode,
          data: updatedData
        };
      } catch (error: any) {
        statusCode = error.statusCode;
        result = this._getErrorResponse(error);
      }

      response.status(statusCode).send(JSON.stringify(result));
    } catch (error: any) {
      const errorResult = this._getErrorResponse(error);
      response.status(errorResult.status).send(JSON.stringify(errorResult));
    }
  }

  public async deleteVersion(request: Request, response: Response): Promise<void> {
    try {
      let result;
      let statusCode = 200;
      const version = request.query.value;

      try {
        await this.versionService.deleteVersion(version);
        result = {
          status: statusCode
        };
      } catch (error: any) {
        statusCode = error.statusCode;
        result = this._getErrorResponse(error);
      }

      response.status(statusCode).send(JSON.stringify(result));
    } catch (error: any) {
      const errorResult = this._getErrorResponse(error);
      response.status(errorResult.status).send(JSON.stringify(errorResult));
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
