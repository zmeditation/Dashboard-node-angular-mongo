import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IOwnManagersResponse } from './interfaces/own-managers-response.interface';
import { catchError } from 'rxjs/operators';
import { Invoice } from 'shared/interfaces/common.interface';
import { GetUsersRequestType } from './types';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  public constructor(private http: HttpClient) { }

  // Implement your APIs ********
  /**
   * @param {GetUsersRequestType} data
   */
  getUsers(data: GetUsersRequestType): Observable<any> {
    return this.http.get(`${ environment.apiURL }/users`, {
      params: data
    });
  }

  getRoles(): Observable<any> {
    return this.http.get(`${ environment.apiURL }/users/roles`);
  }

  // TODO: delete
  getUser(id): Observable<any> {
    return this.http.get(`${ environment.apiURL }/users/${ id }`);
  }

  ownManagers(): Observable<IOwnManagersResponse> {
    return this.http.get<IOwnManagersResponse>(`${ environment.apiURL }/users/get-managers`);
  }

  getOriginProperties(): Observable<any> {
    return this.http.get(`${ environment.apiURL }/reports/filters/31583`);
  }

  // TODO: Delete
  addUser(user): Observable<any> {
    return this.http.post(`${ environment.workerApiURL_1 }/users`, user);
  }

  addUserWbid(user): Observable<any> {
    return this.http.post(`${ environment.apiURL }/wbid/user`, user);
  }

  updateUserWbid(user): Observable<any> {
    return this.http.post(`${ environment.apiURL }/wbid/update-user`, user);
  }

  deleteUserWbid(user): Observable<any> {
    return this.http.post(`${ environment.apiURL }/wbid/delete-user`, user);
  }

  getFreeUsers(usertype?: string) {
    const u = usertype === 'publisher' ? 'PUBLISHER' : 'ACCOUNT MANAGER';
    return this.http.get(`${ environment.apiURL }/users?roles=${ u }&noRef=true`);
  }

  deleteUser(row): Observable<any> {
    return this.http.get(`${ environment.apiURL }/users/delete/${ row.id }`);
  }

  getListOfAttachments() {
    return this.http.get(`${ environment.apiURL }/attachments/get-attachments-list`);
  }

  getAPIToken() {
    return this.http.get(`${ environment.apiURL }/users/get-api-token`);
  }

  getVacantById(userId) {
    return this.http.get(`${ environment.workerApiURL_1 }/users/vacant-properties/${ userId }`);
  }

  getEmailsList() {
    return this.http.get(`${ environment.apiURL }/users/publishers-emails`);
  }

  changeInvoiceStatus(id: string, status: string, publisher: string, cancelReason = undefined) {
    return this.http.patch(`${ environment.apiURL }/invoice/${ id }`, { status, publisher, cancelReason }).pipe((data) => {
      return data;
    });
  }

  getInvoices(reqData): Observable<any> {
    return (
      this.http
        .post(environment.apiURL + '/invoice/get', reqData)
        .pipe(
          catchError((err) => {
            return throwError(err);
          })
        )
        // @ts-ignore
        .pipe((data: Invoice[]) => {
          return data;
        })
    );
  }

  deleteInvoice(id: string): Observable<any> {
    return this.http.delete(`${ environment.apiURL }/invoice/${ id }`).pipe((data) => {
      return data;
    });
  }

  downloadInvoice(id): Observable<Blob> {
    return this.http.get(`${ environment.apiURL }/invoice/${ id }`, { responseType: 'blob' });
  }

  loadExample(): Observable<Blob> {
    return this.http.get(`${ environment.apiURL }/invoice/example`, { responseType: 'blob' });
  }

  updateDomain(body) {
    return this.http.post(`${ environment.workerApiURL_1 }/domains/update`, body);
  }

  getUserDomains(query) {
    const params = `?user=${ query }`;
    return this.http.get(`${ environment.apiURL }/domains/get${ params }`);
  }

  getUsersUnits(query) {
    const params = `?user=${ query }`;
    return this.http.get(`${ environment.apiURL }/units/get${ params }`);
  }

  /* Revenue endpoints */

  createRevenue(body): Observable<any> {
    return this.http.post(`${ environment.apiURL }/revenue/create`, body);
  }

  getAllRevenues(): Observable<any> {
    return this.http.get(`${ environment.apiURL }/revenue`);
  }

  getSelectedRevenues(query): Observable<any> {
    return this.http.get(`${ environment.apiURL }/revenue/find?${ query }`);
  }

  updateRevenue(body): Observable<any> {
    return this.http.patch(`${ environment.apiURL }/revenue/update`, body);
  }

  deleteRevenue(query): Observable<any> {
    return this.http.delete(`${ environment.apiURL }/revenue/delete?${ query }`);
  }

  rewriteRevenues(query) {
    return this.http.post(`${ environment.apiURL }/revenue/rewrite`, query);
  }

  /* Notice endpoints */

  getNoticeList() {
    return this.http.get(`${ environment.apiURL }/notice/list`);
  }

  createNotice(body) {
    return this.http.post(`${ environment.workerApiURL_1 }/notice`, body);
  }

  getNotice() {
    return this.http.get(`${ environment.apiURL }/notice`);
  }

  deleteNotice(query) {
    return this.http.delete(`${ environment.workerApiURL_1 }/notice?id=${ query._id }`);
  }
}
