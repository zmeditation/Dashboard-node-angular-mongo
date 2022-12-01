import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';

interface PassResponse {
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PassService {
  constructor(private http: HttpClient) {}

  changePass(email): Observable<PassResponse> {
    return this.http.post<PassResponse>(environment.apiURL + '/passchange', {
      email
    });
  }
}
