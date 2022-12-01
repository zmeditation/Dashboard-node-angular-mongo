import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportDownloadService {
  constructor(private http: HttpClient) {}

  downloadFile(): Observable<any> {
    return this.http
      .get(`${ environment.apiURL }/reports/download`, {
        observe: 'response' as 'body',
        responseType: 'blob' as const
      })
      .map((resObj: any) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(resObj.body);
        a.download = 'report.csv';
        a.click();
      })
      .catch((errorObj: any) => Observable.throw(errorObj || 'Server error'));
  }
}
