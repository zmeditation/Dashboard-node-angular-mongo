import { VersionType, UpdateVersionType, GetVersionInformationParamsType } from './types';
import { ValueObject } from '../../types/object';

export interface VersionContract {
  createVersion(data: VersionType): Promise<VersionType | never>;
  updateVersion(data: UpdateVersionType): Promise<VersionType | never>;
  deleteVersion(version: string): Promise<boolean | never>;
  getVersionList(userRole: string): Promise<ValueObject[] | never>;
  getVersionInformation(data: GetVersionInformationParamsType): Promise<VersionType | never>;
  getLastVersion(): Promise<ValueObject | never>
}
