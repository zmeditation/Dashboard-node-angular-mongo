import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GetUsersRequestType, GetUsersResponseType, GetUserRequestQueryParametersType } from './types';

@Injectable({
  providedIn: 'root'
})
export class UsersEndpointsService {
  public constructor(protected http: HttpClient) {}

  public getUsers(data: GetUsersRequestType): Observable<GetUsersResponseType> {
    return this.http.get<GetUsersResponseType>(`${ environment.apiURL }/users`, {
      params: data
    });
  }

  public getList(data: GetUsersRequestType): Observable<GetUsersResponseType> {
    return this.http.get<GetUsersResponseType>(`${ environment.apiURL }/users/list`, {
      params: data
    });
  }

  public getUser(id: number | string, query?: GetUserRequestQueryParametersType): Observable<any> {
    query = query ? query : {};
    return this.http.get(`${ environment.apiURL }/users/${ id }`, {
      params: query
    });
  }

  public getRoles(): Observable<any> {
    return this.http.get(`${ environment.apiURL }/users/roles`);
  }

  public createUser(user: any): Observable<any> {
    return this.http.post(`${ environment.workerApiURL_1 }/users`, user);
  }

  public addUserWbid(user: any): Observable<any> {
    return this.http.post(`${ environment.workerApiURL_1 }/wbid/user`, user);
  }

  public updateUser(id: string | number, data: any): Observable<any> {
    return this.http.put(`${ environment.workerApiURL_1 }/users/${ id }`, data);
  }
}
