import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import {
  CreatedMessageResponse,
  CreateNewMessage,
  GetNoticesByUserIdQuery,
  GetUsersResponseForNotice,
  NotificationForUI,
  NotificationResByUserId
} from 'shared/interfaces/notifications.interface';
import { GetUsersQuery } from 'shared/interfaces/users.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationCrudService {
  private notifications: NotificationForUI[] = [
    {
      type: 'SYSTEM_NOTIFICATIONS',
      typeDB: 'systemNf',
      icon: 'sync_problem',
      color: 'warn',
      notifications: []
    },
    {
      type: 'USERS_NOTIFICATIONS',
      typeDB: 'userNf',
      icon: 'account_box',
      color: 'accent',
      notifications: []
    },
    {
      type: 'BILLING_NOTIFICATIONS',
      typeDB: 'billingNf',
      icon: 'attach_money',
      color: 'primary',
      notifications: []
    }
  ];

  constructor(private http: HttpClient) {}

  getNotices(query: GetNoticesByUserIdQuery): Observable<NotificationForUI[]> {
    const { userId } = query;
    return this.http.get(environment.apiURL + `/notifications/${ userId }`).pipe(
      map((notice: NotificationResByUserId) => {
        const { userNf, billingNf, systemNf } = notice.userNotifications;

        if (!notice || (!userNf && !billingNf && !systemNf)) { return this.notifications; } 

        this.notifications.forEach((obj) => {
          obj.notifications = [...notice.userNotifications[obj.typeDB]];
        });

        return this.notifications;
      }),
      catchError((err) => of(this.notifications))
    );
  }

  getUsers(query: GetUsersQuery): Observable<GetUsersResponseForNotice> {
    return this.http.post<GetUsersResponseForNotice>(environment.apiURL + '/users/get-publishers', { query });
  }

  createMessage(params: CreateNewMessage): Observable<CreatedMessageResponse> {
    return this.http.post<CreatedMessageResponse>(environment.apiURL + '/notifications/create', { params });
  }
}
