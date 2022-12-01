import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  GetAccountManagersByEditPermissionsParametersType,
  GetAccountManagersByEditPermissionsResponseType,
  BindAccountManagerToPublisherParams
} from './types';

@Injectable({
  providedIn: 'root'
})
export class AccountManagerEndpointsService {
  protected url?: string = '/users/account-manager';

  public constructor(protected http: HttpClient) {}

  public getAccountManagersByEditPermissions(
    params?: GetAccountManagersByEditPermissionsParametersType
  ): Observable<GetAccountManagersByEditPermissionsResponseType> {
    return this.http.get<GetAccountManagersByEditPermissionsResponseType>(
      `${ environment.apiURL }${ this.url }/by-edit-all-pubs-permission`, {
        params
      }
    );
  }

  public bindAccountManagerToPublisher(params: BindAccountManagerToPublisherParams): Observable<any> {
    return this.http.post<any>(`${ environment.workerApiURL_1 }${ this.url }/bind-to-publisher`, params);
  }
}

