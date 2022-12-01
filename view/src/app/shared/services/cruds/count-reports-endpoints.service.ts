import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GetCountOfReportsTotalAndProgrammaticsResponseType } from './types';

@Injectable({
  providedIn: 'root'
})
export class CountReportsEndpointsService {
  protected url = '/reports/count';

  public constructor(
    protected http: HttpClient
  ) {}

  public getCountOfReportsTotalAndProgrammatics(userId): Observable<GetCountOfReportsTotalAndProgrammaticsResponseType> {
    return this.http.get<GetCountOfReportsTotalAndProgrammaticsResponseType>(
      `${ environment.apiURL }${ this.url }/reports-and-programmatics/${ userId }`);
  }
}

