import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VersionType, UpdateVersionType, GetVersionIntoParamsTypes } from 'shared/types/version';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VersionEndpointsService {
  protected url?: string = `${ environment.apiURL }/version`;

  public constructor(protected http: HttpClient) {}

  public getLastVersion(): Observable<any> {
    return this.http.get<any>(`${ this.url }/last-version`);
  }

  public getVersionList(userRole: string): Observable<any> {
    return this.http.get<any>(`${ this.url }/list/`, {
      params: { userRole }
    });
  }

  public getVersionInformation(data: GetVersionIntoParamsTypes): Observable<any> {
    return this.http.get<any>(`${ this.url }/`, {
      params: data
    })
  }

  public createVersion(data: VersionType): Observable<any> {
    return this.http.post<any>(`${ this.url }/`, {
      params: data
    });
  }

  public updateVersion(data: UpdateVersionType): Observable<any> {
    return this.http.put<any>(`${ this.url }/`, {
      params: data
    });
  }

  public deleteVersion(version: string): Observable<any> {
    return this.http.delete<any>(`${ this.url }/`, {
      params: {
        value: version
      }
    });
  }
}
