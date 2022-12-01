import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Helpers } from './helpers';

interface ListOfProperties {
  name: string;
  success: boolean;
  results: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  constructor(private http: HttpClient, private helpers: Helpers) {}

  getAllAdapters(): Observable<string[]> {
    return this.http
      .post(`${ environment.apiURL }/wbid/get-all-adapters`, {
        path: '/getAllAdapters',
        method: 'GET'
      })
      .pipe(
        map((data: any) => {
          return data.results;
        })
      );
  }

  getAnalyticsList(): Observable<string[]> {
    return this.http
      .post(`${ environment.apiURL }/wbid/get-all-analytics-adapters`, {
        path: '/getAnalyticsList',
        method: 'GET'
      })
      .pipe(
        map((data: any) => {
          return data.results;
        })
      );
  }

  getSettings(adapters: string[]): Observable<any> {
    const DATA = {
      adaptersList: adapters,
      path: '/getAdaptersSettings',
      method: 'POST'
    };
    const body = new HttpParams({ fromObject: DATA });
    return this.http.post(`${ environment.apiURL }/wbid/get-adapters-settings`, body).pipe(
      map((data: any) => {
        return this.helpers.parseAdaptersSettings(data);
      })
    );
  }

  getAnalyticsSettings(adapters: string[]): Observable<any[]> {
    const DATA = {
      analytics: adapters,
      path: '/getAnalyticsSettings',
      method: 'POST'
    };
    const body = new HttpParams({ fromObject: DATA });
    return this.http.post(`${ environment.apiURL }/wbid/get-adapters-settings`, body).pipe(
      map((data: any) => {
        return data.results;
      })
    );
  }

  addConfigToUser(req: any, socketId: string): Observable<any> {
    delete req.toAll;
    req.path = '/addConfigToUser';
    req.method = 'POST';
    req.socketId = socketId;
    const body = new HttpParams({ fromObject: req });
    return this.http.post(`${ environment.apiURL }/wbid/add-config-to-user`, body).pipe(
      map((data: any) => {
        return data.results;
      })
    );
  }

  addPrebidConfig(req: any, socketId: string): Observable<any> {
    delete req.toAll;
    req.path = '/addPrebidConfig';
    req.method = 'POST';
    req.socketId = socketId;
    const body = new HttpParams({ fromObject: req });
    return this.http.post(`${ environment.apiURL }/wbid/add-config-to-user`, body).pipe(
      map((data: any) => {
        return data.results;
      })
    );
  }

  editPostbidConfig(req: any, socketId: string): Observable<any> {
    req.path = '/editPostbidConfig';
    req.method = 'POST';
    req.socketId = socketId;
    const body = new HttpParams({ fromObject: req });
    return this.http.post(`${ environment.apiURL }/wbid/edit-postbid-config`, body).pipe(
      map((data: any) => {
        return data.results;
      })
    );
  }

  editPrebidConfig(req: any, socketId: string): Observable<any> {
    req.path = '/editPrebidConfig';
    req.method = 'POST';
    req.socketId = socketId;
    const body = new HttpParams({ fromObject: req });
    return this.http.post(`${ environment.apiURL }/wbid/edit-postbid-config`, body).pipe(
      map((data: any) => {
        return data.results;
      })
    );
  }

  editShortTagConfig(req: any, socketId: string): Observable<any> {
    req.path = '/editShortTag';
    req.method = 'POST';
    req.socketId = socketId;
    const body = new HttpParams({ fromObject: req });
    return this.http.post(`${ environment.apiURL }/wbid/edit-postbid-config`, body).pipe(
      map((data: any) => {
        return data.results;
      })
    );
  }

  getShortTag(req: any, socketId: string): Observable<any> {
    req.path = '/getShortTag';
    req.method = 'POST';
    req.socketId = socketId;
    const body = new HttpParams({ fromObject: req });
    return this.http.post(`${ environment.apiURL }/wbid/add-config-to-user`, body).pipe(
      map((data: any) => {
        return data.results;
      })
    );
  }

  getUsersList(): Observable<any> {
    return this.http
      .post(`${ environment.apiURL }/wbid/get-list-users`, {
        path: '/getUsersList',
        method: 'GET'
      })
      .pipe(
        map((data: any) => {
          return this.helpers.parseUsersList(data);
        })
      );
  }

  getUserConfigs(id: string): Observable<any> {
    return this.http
      .post(`${ environment.apiURL }/wbid/get-site`, {
        path: `/getSite/${ id }`,
        method: 'GET'
      })
      .pipe(
        map((data: any) => {
          return this.helpers.parseConfigsList(data);
        })
      );
  }

  getUserSites(id: string): Observable<any> {
    return this.http
      .post(`${ environment.apiURL }/wbid/get-user`, {
        path: `/getUser/${ id }`,
        method: 'GET'
      })
      .pipe(
        map((data: any) => {
          const { user } = data.results;
          return user;
        })
      );
  }

  async editSite(siteId, domain, adapters, socketId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${ environment.apiURL }/wbid/edit-site-name`, {
          path: '/editSite',
          method: 'POST',
          responseType: 'json',
          siteId,
          domain,
          adapters,
          socketId
        })
        .subscribe(
          (data: any) => {
            resolve(data.results);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  async deleteConfig(id, socketId, configName, siteId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${ environment.apiURL }/wbid/delete-config`, {
          path: '/deleteConfig',
          method: 'POST',
          responseType: 'text',
          id,
          socketId,
          configName,
          siteId
        })
        .subscribe(
          (data: any) => {
            resolve(data.results);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  async deleteSite(siteId, socketId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${ environment.apiURL }/wbid/delete-config`, {
          path: '/deleteSite',
          method: 'POST',
          responseType: 'text',
          siteId,
          socketId
        })
        .subscribe(
          (data: any) => {
            resolve(data.results);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  async getTags(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${ environment.apiURL }/wbid/get-tags`, {
          path: `/getTags/${ id }`,
          method: 'GET'
        })
        .subscribe(
          (data: { fulltag: string; passbackTag: string, results: any }) => {
            resolve(data.results);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getUserDataByConfigId(id: any): Observable<any> {
    return this.http
      .post(`${ environment.apiURL }/wbid/get-config`, {
        path: `/getconfig/${ id }`,
        method: 'GET'
      })
      .pipe(
        map((data: any) => {
          return {
            userId: data.results.userId || data.results.UserId
          };
        })
      );
  }

  getConfigById(id: any): Observable<any> {
    return this.http
      .post(`${ environment.apiURL }/wbid/get-config`, {
        path: `/getconfig/${ id }`,
        method: 'GET'
      })
      .pipe(
        map((data: any) => {
          return this.helpers.parseConfigData(data);
        })
      );
  }

  checkAuth(networkId, socket): Observable<any> {
    return this.http
      .post(`${ environment.apiURL }/wbid/get-auth`, {
        path: '/get-auth',
        method: 'POST',
        networkId,
        socket
      })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  getPubsDomainsUnits() {
    return this.http.post(`${ environment.apiURL }/wbid/16710`, {
      path: '/getWbidUsersById',
      method: 'POST'
    });
  }

  getAdsTxt(domains: string[]): Observable<any> {
    return this.http.post(`${ environment.apiURL }/wbid/check-ads-txt`, { domains: domains }).pipe(
      map((adsTxtRes: any) => {
        return adsTxtRes.result;
      })
    );
  }

  getPlacementHistory(id: number): Observable<any> {
    return this.http
      .post(`${ environment.apiURL }/wbid/get-placement-history`, {
        path: '/getLog',
        method: 'POST',
        config_id: id
      })
      .pipe(
        map((history: any) => {
          return history.results.logRecord;
        })
      );
  }

  disableUserConfigs(id: number, socketId: string): Observable<any> {
    return this.http
      .post(`${ environment.apiURL }/wbid/disable-user-configs`, {
        path: '/disableUserConfigs',
        method: 'POST',
        id,
        socketId
      })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  enableUserConfigs(id: number, socketId: string): Observable<any> {
    return this.http
      .post(`${ environment.apiURL }/wbid/enable-user-configs`, {
        path: '/enableUserConfigs',
        method: 'POST',
        id,
        socketId
      })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  forceAdsTxtCheck(id: number | string, socketId: string): Observable<any> {
    return this.http
      .post(`${ environment.apiURL }/wbid/user-check-ads-txt`, {
        path: '/forceAdsTxtCheck',
        method: 'POST',
        id,
        socketId
      })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  editUserPermissions(typeOfAction: string, id: string, permissions: string[], role?: string): Observable<any> {
    return this.http.post(
      `${ environment.apiURL }/permissions/edit-permissions`,
      { query: { id, permissions, typeOfAction, role: role ? role : '' } }
    );
  }

  addAnalytics(query: any): Observable<any> {
    return this.http
      .post(`${ environment.apiURL }/tac/code-generation`, {
        path: '/addAnalytics',
        method: 'POST',
        query
      })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  createGptAdUnit(query): Observable<any> {
    return this.http.post(`${ environment.apiURL }/mediators/add-new-unit`, query).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  getMetricsByRouteCode(type: string, codes: string[]): Observable<ListOfProperties[]> {
    if (Array.isArray(codes) === true && codes.length > 0 && typeof codes !== 'string') {
      const requests = codes.map((code) => {
        return this.http.get(`${ environment.apiURL }/${ type }/${ code }`).pipe(
          map((data: ListOfProperties) => {
            return data;
          })
        );
      });
      return Observable.zip(...requests);
    }
  }


  getPackCode(data): Observable<any> {
    return this.http.post(
      `${ environment.apiURL }/mediators/get-pack-code`,
      data
    )
  }

  createCode(data): Observable<any> {
    return this.http.post(
      `${ environment.apiURL }/codes/create`,
      data
    )
  }

  getUserCodes(id: string): Observable<any> {
    return this.http.get(`${ environment.apiURL }/codes/${id}`);
  }

  updatePackCode(data): Observable<any> {
    return this.http.put(`${ environment.apiURL }/mediators/update-pack-code`, data);
  }

  deletePackCode(query): Observable<any> {
    return this.http.delete(`${ environment.apiURL }/mediators/delete-pack-code?${query}`);
  }
}
