import User from '../../../../database/mongoDB/migrations/UserModel';
import Reports from '../../../../database/mongoDB/migrations/reportModel';
import GetItemsCountByPubIdMDBException from './exceptions/getItemsCountByPubIdMDBException';
import UpdatePubAccByLimitMDBException from './exceptions/updatePubAccByLimitMDBException';
import GetPubIdsMDBException from './exceptions/getPubIdsMDBException';
import GetPubUpdateDataMDBException from './exceptions/getPubUpdateDataMDBException';
import UpdateAllPubsAccMDBException from './exceptions/updateAllPubsAccMDBException';
import Iterator from '../../../../utils/iterator';
import { PubAMUpdateReportsContract } from './interfaces';
import { IterationDataType } from '../../../../utils/iterator/types';
import { UserMDB } from '../../../../types/user';
import { UpdatePubAMResultType, PublisherDataType } from './types';

export default class PubAMUpdateReportsService implements PubAMUpdateReportsContract {
  protected startIndex = 0;
  protected limit = 400000;

  /**
   * @yields {UpdatePubAMResultType}
   */
  public async *update(publisherId: string): AsyncGenerator<any, any, any> {
    const data = await this.getPublisherUpdateData(publisherId);
    const itemsCount = await this.getItemsCountByPublisherId(data);

    if (!itemsCount) {
      yield {
        completed: true,
        countUpdatedItems: itemsCount,
        data
      };
      return;
    }

    if (itemsCount <= this.limit) {
      yield {
        completed: true,
        countUpdatedItems: itemsCount,
        data
      };
      return;
    }

    const iterateObj = Iterator.generateAsyncLimitIterator({
      from: this.startIndex,
      to: itemsCount,
      limit: this.limit,
      asyncFunction: this.updatePublisherAccountManagerByLimit.bind(this),
      asyncFunctionParams: data
    });

    for await (let value of iterateObj) {
      yield {
        completed: false,
        updatedItemsPerLimit: value.nModified,
        data
      };
    }

    yield {
      completed: true,
      countUpdatedItems: itemsCount
    };
  }

  protected async getPublisherUpdateData(publisherId: string): Promise<PublisherDataType | never> {
    try {
      const publisherData: UserMDB = await User.findById(publisherId, ['am', 'name']).lean();

      return {
        publisherId,
        accountManagerId: publisherData.am.toString(),
        pubName: publisherData.name
      };
    } catch (error: any) {
      throw new GetPubUpdateDataMDBException(error.stack);
    }
  }

  protected async getItemsCountByPublisherId(data: PublisherDataType): Promise<number | never> {
    try {
      return await Reports.countDocuments({
        'property.refs_to_user': data.publisherId,
        'property.am': { $ne: data.accountManagerId }
      });
    } catch (error: any) {
      throw new GetItemsCountByPubIdMDBException(error.stack);
    }
  }

  protected async updateAllPubsAccountManager(data: PublisherDataType): Promise<any | never> {
    try {
      return await Reports.updateMany(
        {
          'property.refs_to_user': data.publisherId,
          'property.am': { $ne: data.accountManagerId }
        },
        {
          'property.am': data.accountManagerId
        }
      );
    } catch (error: any) {
      throw new UpdateAllPubsAccMDBException(error.stack);
    }
  }

  protected async updatePublisherAccountManagerByLimit(
    data: PublisherDataType,
    iterationData: IterationDataType
  ): Promise<{ nModified: number } | never> {
    const ids: string[] = await this.getPublisherIdsToUpdateAccountManager(data, iterationData);

    try {
      return await Reports.updateMany(
        {
          _id: ids
        },
        {
          'property.am': data.accountManagerId
        }
      );
    } catch (error: any) {
      throw new UpdatePubAccByLimitMDBException(error.stack);
    }
  }

  protected async getPublisherIdsToUpdateAccountManager(
    data: PublisherDataType,
    iterationData: IterationDataType
  ): Promise<string[] | never> {
    try {
      const ids = await Reports.find(
        {
          'property.refs_to_user': data.publisherId,
          'property.am': { $ne: data.accountManagerId }
        },
        ['_id']
      )
        .limit(iterationData.limit)
        .lean();

      return ids.map((element: { _id: string }) => element._id);
    } catch (error: any) {
      throw new GetPubIdsMDBException(error.stack);
    }
  }
}
