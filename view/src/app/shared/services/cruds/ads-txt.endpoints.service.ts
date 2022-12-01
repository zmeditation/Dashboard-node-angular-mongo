import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AdsTxtEndpointsService {

  constructor(
		private http: HttpClient
  ) {}

  public getCheckedDomains(): Observable<any> {
    return this.http.get(`${ environment.workerApiURL_1 }/users/ads-txt-monitoring`);
  }
}
