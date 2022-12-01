import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrtbEndpointsService {

  public constructor(
    protected http: HttpClient
  ) {}

  SSP(): Observable<{ id: number, name: string }[]> {
    return this.http.get(`${ environment.apiURL }/users/ssp-partners`).pipe((data: any) => {
      return data;
    });
  }

  DSP(): Observable<{ id: number, name: string }[]> {
    return this.http.get(`${ environment.apiURL }/users/dsp-partners`).pipe((data: any) => {
      return data;
    });
  }

  addRTBPartner(query): Observable<any> {
    return this.http.post(`${ environment.workerApiURL_1 }/users/add-rtb-partner`, query);
  }
}
