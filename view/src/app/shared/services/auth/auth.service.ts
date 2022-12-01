import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { EventCollectorService } from '../event-collector/event-collector.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NgxPermissionsService } from 'ngx-permissions';
import { catchError, tap } from 'rxjs/internal/operators';

interface AuthResponse {
  success: boolean;
  token: string;
  user: any;
  msg: string;
}

export interface SignInObj {
  email: string;
  password: string;
  keepSignedIn: boolean;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public token: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngxPermissions: NgxPermissionsService,
    private eventCollectorService: EventCollectorService
  ) {
    this.token = localStorage.getItem('currentUser');
  }

  authenticate(signInObj: SignInObj): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(environment.apiURL + '/authenticate', JSON.stringify(signInObj), httpOptions);
  }

  auth(signInObj: SignInObj): Observable<any> {
    return this.authenticate(signInObj).pipe(
      tap((response: any) => {
        const { success, token, user, msg } = response;

        if (!success) {
          return {
            success: false,
            msg
          }; 
        }


        localStorage.removeItem('ua');

        this.eventCollectorService.pushUserAvatar(user.photo);
        this.ngxPermissions.loadPermissions(user.permissions);
        this.eventCollectorService.pushUserInfo(user);

        localStorage.setItem('currentUser', token);

        return {
          success
        };
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  out() {
    this.ngxPermissions.flushPermissions();
    localStorage.removeItem('currentUser');
    this.router.navigate(['sessions/sign-in']);
    // window.location.reload();
  }

  publisherViewAuth(userId: string) {
    return this.http.get<AuthResponse>(
      environment.apiURL + `/publisher-view-authenticate/${userId}`
    );
  }
}
