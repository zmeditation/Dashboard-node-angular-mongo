import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ROLES, USERS } from 'shared/tests_materials/export.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class UsersEndpointsInterceptorMock implements HttpInterceptor {
  public constructor(protected injector: Injector) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url) { return next.handle(request); }


    switch (request.url) {
      case `${ environment.apiURL }/users/roles`:
        return of(new HttpResponse({ status: 200, body: ROLES }));
      case `${ environment.apiURL }/users`:
        return of(new HttpResponse({ status: 200, body: USERS }));
      default:
        return;
    }
  }
}
