import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionsHTTP {
  constructor(private http: HttpClient) {}

  queryGetPermissions(): Observable<any> {
    return this.http.get(environment.apiURL + '/permissions/get');
  }

  queryGetPublishers(query): Observable<any> {
    return this.http.post(environment.apiURL + '/users/get-publishers', {
      query
    });
  }

  queryPermission(query): Observable<any> {
    return this.http.post(`${ environment.apiURL }/permissions/edit-permissions`, { query });
  }

  queryAddOne(permissions): Observable<any> {
    return this.http.post(environment.apiURL + '/permissions/', permissions);
  }

  queryRemoveOne(permission): Observable<any> {
    const body = {
      perm_to_delete: permission
    };
    return this.http.patch(environment.apiURL + '/permissions/remove-one/', body);
  }

  queryAddRole(object): Observable<any> {
    return this.http.post(environment.apiURL + '/permissions/add-role/', object);
  }

  queryRemoveRole(id): Observable<any> {
    return this.http.get(environment.apiURL + '/permissions/remove-role/' + id);
  }
}
