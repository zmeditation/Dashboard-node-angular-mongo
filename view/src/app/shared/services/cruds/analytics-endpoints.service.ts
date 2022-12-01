import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/index';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MonthlyStatistic, TAnalyticsData, TPublishersConnectionStatistics } from '../../interfaces/statistic.interface';
import { TestUsersStatisticsResponseType } from './types';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsEndpointsService {
  private _queryHandler = new Subject<any>();

  query$ = this._queryHandler.asObservable();

  constructor(private http: HttpClient) {}

  getManagersAnalyticsLastThirtyDays(): Observable<any> {
    return this.http.get(`${ environment.apiURL }/analytics/managers-for-last-thirty-days`);
  }

  updateManagersAnalyticsLastThirtyDays(): Observable<any> {
    return this.http.post(`${ environment.workerApiURL_1 }/analytics/managers-for-last-thirty-days`, { runAnalyticsUpdate: true });
  }

  getPublishersOfAccountManagers(): Observable<any> {
    return this.http.get(`${ environment.apiURL }/reports/filters/64509`);
  }

  getApiPublishersRevenue(query): Observable<any> {
    return this.http.post(`${ environment.workerApiURL_1 }/reports/get-revenue/`, { query });
  }

  getMonthlyInfo(userId: string = '') {
    return this.http.get<{
      result: MonthlyStatistic, 
      success: boolean,
    }>(`${ environment.apiURL }/reports/monthly/${userId}`);
  }

  getApiDeduction(query): Observable<any> {
    return this.http.post(`${ environment.apiURL }/deductions/deduction-by-param`, { query });
  }

  getPublishersCountByMonth(): Observable<TPublishersConnectionStatistics> {
    return this.http.get<TPublishersConnectionStatistics>(`${ environment.workerApiURL_1 }/analytics/pubs-connection-statistics`);
  }

  getPubsAnalyticsLastThirtyDays(): Observable<TAnalyticsData> {
    return this.http.get<TAnalyticsData>(`${ environment.apiURL }/analytics/publishers-for-last-thirty-days/`);
  }

  updatePubsAnalyticsLastThirtyDays(): Observable<TAnalyticsData> {
    return this.http.post<TAnalyticsData>(`${ environment.workerApiURL_1 }/analytics/publishers-for-last-thirty-days/`, {
      runAnalyticsUpdate: true
    });
  }

  getNewPubsAnalyticsForLastMonth(): Observable<TAnalyticsData> {
    return this.http.get<TAnalyticsData>(`${ environment.apiURL }/analytics/publishers-for-last-month/`);
  }

  updateNewPubsAnalyticsForLastMonth(): Observable<TAnalyticsData> {
    return this.http.post<TAnalyticsData>(`${ environment.workerApiURL_1 }/analytics/publishers-for-last-month/`, {
      runAnalyticsUpdate: true
    });
  }

  getNewPubsAnalyticsForCurrentMonth(): Observable<TAnalyticsData> {
    return this.http.get<TAnalyticsData>(`${ environment.apiURL }/analytics/publishers-for-current-month/`);
  }

  updateNewPubsAnalyticsForCurrentMonth(): Observable<TAnalyticsData> {
    return this.http.post<TAnalyticsData>(`${ environment.workerApiURL_1 }/analytics/publishers-for-current-month/`, {
      runAnalyticsUpdate: true
    });
  }

  public getTestUsers(roles: string[]): Observable<TestUsersStatisticsResponseType> {
    return this.http.get<TestUsersStatisticsResponseType>(`${ environment.apiURL }/analytics/users/test`, {
      params: {
        roles: roles.join()
      }
    });
  }
}
