import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FILTER_IDS } from './filter-request-ids';
import { ChartQueryObject, QueryObject } from "shared/interfaces/reporting.interface";

@Injectable({
  providedIn: 'root'
})
export class FilterRequestService {
  private _queryHandler = new Subject<any>();

  query$ = this._queryHandler.asObservable();

  constructor(private http: HttpClient) {}

  getFilterResultsById(id: FILTER_IDS | any, type?: string): Observable<any> {
    if (type === undefined) {
      return this.http.get(`${ environment.apiURL }/reports/filters/${ id }`);
    } else {
      switch (
        type // add other routes later
      ) {
        case 'oRTB': {
          return this.http.get(`${ environment.apiURL }/rtb/${ id }`);
        }
        default:
          return;
      }
    }
  }

  sendQuery(queryObject: QueryObject | ChartQueryObject) {
    this._queryHandler.next(queryObject);
  }

  getDataCharts(queryObject: QueryObject | any, typeOfReport?: string): Observable<any> {
    if (!!typeOfReport && typeOfReport === 'oRTB') {
      return this.http.post(`${ environment.workerApiURL_1 }/rtb/run-report`, queryObject);
    } else {
      return this.http.post(`${ environment.workerApiURL_1 }/reports/run-report`, queryObject);
    }
  }

  getChartsData(body: any) {
    return this.http.post(`${ environment.workerApiURL_1 }/wbid/analytics-charts`, body);
  }
}
