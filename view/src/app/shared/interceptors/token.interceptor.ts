import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TemporaryTokenStorageService } from '../services/temporary-token-storage.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private tempTokenStorageService: TemporaryTokenStorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('currentUser');
    const publisherToken = this.tempTokenStorageService.publisherViewToken;

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: publisherToken || token
        }
      }); 
    } 
    
    return next.handle(request);
  }
}
