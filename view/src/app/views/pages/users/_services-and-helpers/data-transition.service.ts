import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTransitionService {
  private subject = new Subject<any>();

  private subjectRouter = new Subject<any>();

  constructor() {}

  sendMessage(message: any) {
    this.subject.next(message);
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  sendRouteMessage(message: any) {
    this.subjectRouter.next(message);
  }

  getRouterMessage(): Observable<any> {
    return this.subjectRouter.asObservable();
  }

  clearRouterMessage() {
    this.subjectRouter.next();
  }
}
