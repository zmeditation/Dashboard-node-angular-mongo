import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ValidResOfDeleteMsg } from '../../interfaces/notifications.interface';
import { DeleteNoticesCollectionsQuery, DeleteNotificationQuery } from 'shared/interfaces/notifications.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationEndpointsService {
  constructor(private http: HttpClient) {}

  deleteNotice(query: DeleteNotificationQuery): Observable<ValidResOfDeleteMsg> {
    const { msgId } = query;
    return this.http.delete<ValidResOfDeleteMsg>(environment.apiURL + `/notifications/${msgId}`);
  }

  deleteNoticesCollections(query: DeleteNoticesCollectionsQuery): Observable<ValidResOfDeleteMsg> {
    return this.http.delete<ValidResOfDeleteMsg>(
      environment.apiURL + `/notifications/delete-collections/?userId=${query.userId}&msgTypes=${query.msgTypes}`
    );
  }
}
