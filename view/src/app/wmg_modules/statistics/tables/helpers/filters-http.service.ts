import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FiltersHttpService {
  constructor(private http: HttpClient) {}

  getFilterResultsById(id, type = 'default', body?): Observable<any> {
    if (type === 'wbid' && id !== '64509') {
      return body
        ? this.http.post(`${ environment.apiURL }/wbid/${ id }`, body) :
        this.http.get(`${ environment.apiURL }/wbid/${ id }`);
    } else if (type === 'default' || id === '64509') {
      return this.http.get(`${ environment.apiURL }/reports/filters/${ id }`);
    } else if (type === 'tac') {
      return body
        ? this.http.post(`${ environment.apiURL }/tac/${ id }`, body) :
        this.http.get(`${ environment.apiURL }/tac/${ id }`);
    } else if (type === 'oRTB') {
      return body
        ? this.http.get(`${ environment.apiURL }/rtb/${ id }?search=${ body.searchString }&id=${ body.id }`) :
        this.http.get(`${ environment.apiURL }/rtb/${ id }`);
    }
  }

  getReportsSizes(size: string): Observable<any> {
    return this.http.get(`${ environment.apiURL }/reports/sizes/${ size }`).pipe(
      catchError((err) => {
        console.error(err);
        throw new Error('Get sizes error');
      })
    );
  }
}
