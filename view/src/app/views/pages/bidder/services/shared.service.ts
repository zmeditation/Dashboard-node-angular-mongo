import { CrudService } from './crud.service';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AuthGuard } from 'shared/services/auth/auth.guard.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WbidService {
  private unsubscribe$ = new Subject();

  constructor(private crudService: CrudService, public authGuard: AuthGuard) {}

  getAndSaveUserData(_id?): Promise<any> {
    return new Promise((resolve, reject) => {
      let role: string,
        id: string,
        name: string,
        isPrebidUser: boolean,
        userType: string[],
        dashboardId: string,
        trialFrom: string,
        status: string[],
        successAdsTxtCheck: boolean;
      this.authGuard
        .verifyToken()
        .takeUntil(this.unsubscribe$)
        .subscribe(
          (data: any) => {
            role = data.user.role;
            id = data.user.wbidUserId;
            name = data.user.name;

            if (id) {
              this.crudService
                .getUserSites(id)
                .pipe(
                  catchError((err: HttpErrorResponse) => {
                    return Observable.throwError(err);
                  })
                )
                .takeUntil(this.unsubscribe$)
                .subscribe(
                  (result) => {
                    userType = result.wbidType;
                    isPrebidUser = result.wbidType ? result.wbidType.includes('prebid') : undefined;
                    dashboardId = result.dashboardId;
                    trialFrom = result.trialFrom;
                    status = result.status;
                    successAdsTxtCheck = result.successAdsTxtCheck;
                    resolve({
                      role,
                      id,
                      name,
                      userType,
                      isPrebidUser,
                      dashboardId,
                      trialFrom,
                      status,
                      successAdsTxtCheck
                    });
                  },
                  (err) => {
                    console.error(err.message || err);
                  }
                );
            } else if (_id) {
              this.crudService
                .getUserSites(_id)
                .pipe(
                  catchError((err: HttpErrorResponse) => {
                    return Observable.throwError(err);
                  })
                )
                .takeUntil(this.unsubscribe$)
                .subscribe(
                  (result) => {
                    userType = result.wbidType;
                    isPrebidUser = result.wbidType.includes('prebid');
                    dashboardId = result.dashboardId;
                    trialFrom = result.trialFrom;
                    status = result.status;
                    successAdsTxtCheck = result.successAdsTxtCheck;
                    resolve({
                      role,
                      id,
                      name,
                      userType,
                      isPrebidUser,
                      dashboardId,
                      trialFrom,
                      status,
                      successAdsTxtCheck
                    });
                  },
                  (err) => {
                    console.error(err.message || err);
                  }
                );
            } else {
              resolve({ role, id, name });
            }
          },
          (err) => {
            console.error(err.message || err);
            reject(err);
          }
        );
    });
  }

  getClearDomain(url: string): string {
    let hostname: string;

    url.indexOf('//') > -1 ? (hostname = url.split('/')[2]) : (hostname = url.split('/')[0]);

    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];

    return hostname;
  }
}
