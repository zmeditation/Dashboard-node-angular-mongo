import { GetUsersSettings } from './types';

export interface FilterUsersContract {
  getAllUsers(data: GetUsersSettings): Promise<any>;
  getAllPubs(data: GetUsersSettings): Promise<any>;
  getOwnPubs(data: GetUsersSettings): Promise<any>;
}
