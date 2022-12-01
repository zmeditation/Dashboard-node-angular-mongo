import mongoose from 'mongoose';
const User = mongoose.model<any>('User');
import { FileService } from "../../../services/helperFunctions/FileService";
import Iterator from "../../../../server/utils/iterator";
import { IterationDataType } from 'server/utils/iterator/types';

type UserFindById = {
  _id: mongoose.Types.ObjectId;
  connected_users: {
    am: mongoose.Types.ObjectId[];
    p: mongoose.Types.ObjectId[];
  };
  role: string;
}

type UserInfo = {
  usersIds: mongoose.Types.ObjectId[]; 
  userRole: string;
}

type DomainsData = {
  domainsObject: any;
  filteredResult: any;
}

export class GetCheckedDomainsService {

  protected fileService = new FileService();

  protected pathToFile = '';

  constructor(pathToFile: string) {
    this.pathToFile = pathToFile;
    this.fileService.setPaths(pathToFile);
  }

  public async canReadAllUsers(): Promise<DomainsData> {
    const domainsObject = await this.getDomains();

    return {
      domainsObject,
      filteredResult: domainsObject?.results
    };
  }

  public async canReadAllPubs(userId: string): Promise<DomainsData> {
    const { usersIds, userRole } = await this.getUserInfo(userId);    
    const rolesNotHavePubs = ['AD OPS', 'MEDIA BUYER', 'CEO MANAGE'];
    const publishersIds = !rolesNotHavePubs.includes(userRole)  
      ? await this.findPubsIdsOfManagers(usersIds)
      : null;

    const domainsObject = await this.getDomains();
      
    const filteredResult = publishersIds
      ? domainsObject.results?.filter((obj: any) => publishersIds.includes(obj._id))
      : domainsObject?.results; 
  
    return {
      domainsObject,
      filteredResult
    }
  }

  public async canReadOwnPubs(userId: string): Promise<DomainsData> {
    const domainsObject = await this.getDomains();
    return {
      domainsObject,
      filteredResult: domainsObject.results.filter((obj: any) => obj.am === userId)
    }
  }

  protected async getDomains(): Promise<any> {
    const fileData = await this.fileService.readFile();    
    const defaultObject = { results: [] };

    if (!fileData?.results) { return defaultObject };

    return fileData || defaultObject;
  }

  protected async getUserInfo(userId: string): Promise<UserInfo> {
    const user: UserFindById = await User.findById(userId, '_id connected_users role');
    if (!user) throw new Error(`user is ${user}`);
  
    const usersIds = [
      user._id,
      ...user?.connected_users?.am,
      ...user?.connected_users?.p
    ];

    return {
      usersIds,
      userRole: user.role
    };
  }
  
  protected async findPubsIdsOfManagers(usersIds: mongoose.Types.ObjectId[]): Promise<mongoose.Types.ObjectId[]> {
    const allPubsIds: mongoose.Types.ObjectId[] = [];

    const iterator = Iterator.generateAsyncLimitIterator({
      from: 0, 
      to: usersIds.length, 
      limit: 1, 
      asyncFunction: this.getPubsOfAm.bind(this), 
      asyncFunctionParams: usersIds
    });
    
    for await (const user of iterator) {
      if (user.role === 'ACCOUNT MANAGER') {
        allPubsIds.push(...user.connected_users.p);
      } else if (user.role === 'PUBLISHER') {
        allPubsIds.push(user._id);
      }
    }  
    
    return allPubsIds;
  }

  protected async getPubsOfAm(usersIds: mongoose.Types.ObjectId[], params: IterationDataType): Promise<UserFindById> {    
    const userId = usersIds[params.now];
    return await User.findById(userId, '_id connected_users role');
  }
  
  public isFileExist(): Promise<boolean> {
    return this.fileService.isSpecifiedPathExist(this.pathToFile);
  }

  public async isDomainsFileActual(): Promise<boolean> {
    const fileData = await this.fileService.readFile();
    if (fileData?.lastUpdate) {
      return this.isActualLastUpdate(fileData.lastUpdate);
    }

    console.error(`${this.pathToFile} does not have lastUpdate field`);
    return false;
  }

  protected isActualLastUpdate(lastUpdate: number): boolean {
    const defaultLastUpdateInMs = new Date(2020, 1).getTime();

    if (!lastUpdate) {
      console.error('Not passed lastUpdate');
    }

    const oneHourInMs = 3600000;
    const oneHourInMin = 60;
    const UTCTimezone = (new Date().getTimezoneOffset() / oneHourInMin) * oneHourInMs; // -10800000 ms (3 hours) for UA
    const correctLastTime = (typeof lastUpdate === 'number')
      ? new Date(lastUpdate).getTime()
      : defaultLastUpdateInMs;
    const lastUpdateInMs = correctLastTime + UTCTimezone;
    const nowTimeInMs = new Date().getTime() + UTCTimezone;
    const sixHours = oneHourInMs * 6;

    if ((nowTimeInMs - lastUpdateInMs) >= sixHours) {
      return false;
    }

    return true;
  }
}

