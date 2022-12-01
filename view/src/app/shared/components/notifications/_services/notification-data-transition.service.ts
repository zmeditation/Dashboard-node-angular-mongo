import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationDataTransitionService {
  private notWatchedNoticesSubj = new Subject<any>();

  constructor() {}

  setCountNotWatchedNotices(num: number): void {
    this.notWatchedNoticesSubj.next(num);
  }

  getCountNotWatchedNotices(): Observable<number> {
    return this.notWatchedNoticesSubj.asObservable();
  }
}
