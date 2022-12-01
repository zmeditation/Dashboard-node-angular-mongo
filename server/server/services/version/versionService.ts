import VersionModel from '../../database/mongoDB/migrations/VersionModel';
import Validator from '../../utils/validator';
import CreateVersionSaveMDBException from './exceptions/createVersionSaveMDBException';
import GetLastVersionMDBException from './exceptions/getLastVersionMDBException';
import GetLastVersionNotFoundException from './exceptions/getLastVersionNotFoundException';
import GetVersionListMDBException from './exceptions/getVersionListMDBException';
import GetVersionInformationMDBException from './exceptions/getVersionInformationMDBException';
import GetVersionInformationNotFoundException from './exceptions/getVersionInformationNotFoundException';
import UpdateVersionMDBException from './exceptions/updateVersionMDBException';
import DeleteVersionMDBException from './exceptions/deleteVersionMDBException';
import { VersionContract } from './interfaces';
import { VersionType, UpdateVersionType, DescriptionType, GetVersionInformationParamsType } from './types';
import { ValueObject } from '../../types/object';
import { ROLES } from '../../constants/roles';

export default class VersionService implements VersionContract {
  protected superUsers = [ROLES.ADMIN];

  protected outsideUsers = [ROLES.PUBLISHER];

  protected i = 0;

  public async getLastVersion(): Promise<ValueObject | never> {
    let result;
    this.i++;

    try {
      result = await VersionModel.findOne().sort({
        release_date: -1
      });
    } catch (error: any) {
      throw new GetLastVersionMDBException(error.stack);
    }

    if (!result) {
      throw new GetLastVersionNotFoundException();
    }

    return {
      value: result.version
    };
  }

  public async getVersionList(userRole: string): Promise<ValueObject[] | never> {
    let result;
    const query = this.getVersionListQuery(userRole);

    try {
      result = await VersionModel.find(query)
        .sort({
          release_date: -1
        })
        .lean();
    } catch (error: any) {
      throw new GetVersionListMDBException(error.stack);
    }

    return result.map((element: VersionType) => {
      return {
        value: element.version
      };
    });
  }

  protected getVersionListQuery(userRole: string): object {
    const query: any = {};

    if (this.outsideUsers.includes(userRole)) {
      query['description.out'] = { $ne: null };
    }

    return query;
  }

  public async getVersionInformation(data: GetVersionInformationParamsType): Promise<VersionType | never> {
    let result;

    try {
      result = await VersionModel.findOne({ version: data.version }).lean();
    } catch (error: any) {
      throw new GetVersionInformationMDBException(error.stack);
    }

    if (!result) {
      throw new GetVersionInformationNotFoundException();
    }

    const description = this.getDescription(result.description, data.userRole);

    return {
      _id: result._id,
      version: result.version,
      releaseDate: result.release_date,
      description
    };
  }

  protected getDescription(description: string | DescriptionType | any, userRole: string): string | DescriptionType {
    // TODO: Delete strings: 85, 97, 100-109
    const isStringDescription = Validator.isString(description);
    const isSuperUser = this.superUsers.includes(userRole);

    if (isStringDescription && isSuperUser) {
      return {
        in: description,
        out: ''
      };
    }

    const isOutsideUser = this.outsideUsers.includes(userRole);

    if (isStringDescription && isOutsideUser) {
      return '';
    }

    if (isStringDescription) {
      return description;
    }

    description.out = description.out ? description.out : '';

    if (isSuperUser) {
      return description;
    }

    if (isOutsideUser) {
      return description.out;
    }

    return description.in;
  }

  public async createVersion(data: VersionType): Promise<VersionType | never> {
    let result: any;

    try {
      result = await new VersionModel({
        version: data.version,
        release_date: data.releaseDate,
        description: data.description
      }).save();
    } catch (error: any) {
      throw new CreateVersionSaveMDBException(error.stack);
    }

    return {
      _id: result._id,
      version: result.version,
      releaseDate: result.release_date,
      description: result.description
    };
  }

  public async updateVersion(data: UpdateVersionType): Promise<VersionType | never> {
    try {
      await VersionModel.updateOne(
        {
          version: data.lastVersion
        },
        {
          version: data.newVersion,
          release_date: data.releaseDate,
          description: data.description
        }
      );
    } catch (error: any) {
      throw new UpdateVersionMDBException(error.stack);
    }

    return {
      version: data.newVersion,
      releaseDate: data.releaseDate,
      description: data.description
    };
  }

  public async deleteVersion(version: string): Promise<boolean | never> {
    try {
      await VersionModel.deleteOne({ version });
    } catch (error: any) {
      throw new DeleteVersionMDBException(error.stack);
    }

    return true;
  }
}
