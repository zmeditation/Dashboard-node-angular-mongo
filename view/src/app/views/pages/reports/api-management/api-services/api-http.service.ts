import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { IPaginationRequest, ISelectUserRequest } from 'shared/interfaces/pagination.interface';
import { IUsersSearchResponse } from 'shared/interfaces/users-search-response.interface';

const USERS = 'users';

@Injectable({
  providedIn: 'root'
})
export class ApiHttpService {
  constructor(private http: HttpClient) {}

  removeAPIRecords(query): Observable<any> {
    return this.http.post(`${ environment.apiURL }/reports/remove-reports`, {
      query
    });
  }

  searchUsers(select: ISelectUserRequest, search: string, pagination: IPaginationRequest): Observable<IUsersSearchResponse> {
    const params = { search, pagination, select };

    return this.http.post<IUsersSearchResponse>(`${ environment.apiURL }/${ USERS }/search`, params);
  }

  getPublishersApi(query): Observable<any> {
    return this.http.post(`${ environment.apiURL }/${ USERS }/get-publishers`, {
      query
    });
  }

  getFilterResultsById(id): Observable<any> {
    return this.http.get(`${ environment.apiURL }/reports/filters/${ id }`);
  }

  getOriginProperties(): Observable<any> {
    return this.http.get(`${ environment.apiURL }/reports/api-adapters`);
  }

  getOrigins(): Observable<any> {
    return this.http.get(`${ environment.apiURL }/reports/filters/31583`);
  }

  uploadNewDataOfProgrammatic(req): Observable<any> {
    return this.http.post(`${ environment.workerApiURL_1 }/reports/api-upload`, {
      additional: { permission: 'canAddReports' },
      query: req
    });
  }
}
