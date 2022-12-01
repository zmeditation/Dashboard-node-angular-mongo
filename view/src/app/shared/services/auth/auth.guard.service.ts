import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { NgxPermissionsService } from 'ngx-permissions';
import { EventCollectorService } from '../event-collector/event-collector.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  user: any = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngxPermissions: NgxPermissionsService,
    private eventCollectorService: EventCollectorService
  ) {}

  verifyToken(): Observable<any> {
    return this.http.get<any>(environment.apiURL + '/verify');
  }

  verifyPermissions(): Observable<Response> {
    return this.http.get<Response>(environment.apiURL + '/permVer');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    if (localStorage.getItem('currentUser') !== null) {
      return this.verifyToken().pipe(
        map((res: any) => {
          if (res.expired) {
            localStorage.removeItem('currentUser');
            this.router.navigate(['sessions/sign-in']);
          } else {
            localStorage.removeItem('ua');
            const user = res.user;

            this.eventCollectorService.pushUserAvatar(user.photo);
            this.ngxPermissions.loadPermissions(user.permissions);
            this.eventCollectorService.pushUserInfo(user);

            return true;
          }
        })
      );
    } else { this.router.navigate(['sessions/sign-in']); }

  }
}
