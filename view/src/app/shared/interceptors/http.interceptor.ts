import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FlashMessagesService } from '../services/flash-messages.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class HTTPInterceptor implements HttpInterceptor {
  constructor(
    private flashMessage: FlashMessagesService,
    private translate: TranslateService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).do(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
      },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
          // redirect to the login route
            localStorage.removeItem('currentUser');
            const message = this.translate.instant('SESSION_EXPIRED');
            this.flashMessage.flash('error', message, 3000, 'center');
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
          if (err.status === 504) {
            const message = this.translate.instant('TIMEOUT_REQUEST');
            this.flashMessage.flash('error', message, 15000, 'center');
          }
        }
      }
    );
  }
}
