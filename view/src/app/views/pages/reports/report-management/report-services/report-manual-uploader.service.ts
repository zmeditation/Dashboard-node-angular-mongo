import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportManualUploaderService {
  constructor(public http: HttpClient) {}

  getPlacements() {
    return this.http.get(`${ environment.apiURL }/reports/filters/16607`);
  }

  postDataToServer(DATA) {
    return this.http.post(`${ environment.apiURL }/reports/upload/manual`, {
      reports: DATA
    });
  }

  getLastPostedPlacements() {
    return this.http.get(`${ environment.apiURL }/reports/upload/manual/previous-uploads`);
  }

  deleteLastPostedProperties(id) {
    return this.http.delete(`${ environment.apiURL }/reports/upload/manual/previous-uploads/${ id }`);
  }
}
