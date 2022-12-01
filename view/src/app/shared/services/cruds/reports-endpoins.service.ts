import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {

} from './types';

@Injectable({
  providedIn: 'root'
})
export class ReportsEndpointsService {
  protected url?: string = '/reports';

  public constructor(protected http: HttpClient) {}

  public updatePublisherAccountManager(publisherId: string): Observable<any> {
    return this.http.put(`${ environment.workerApiURL_1 }${ this.url }/publisher-account-manager/${ publisherId }`, {});
  }
}

