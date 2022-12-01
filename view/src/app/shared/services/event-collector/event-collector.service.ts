import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({ providedIn: 'root' })
export class EventCollectorService {
  private _eventHandlerSource = new BehaviorSubject<any>('');

  sendUserFromDialog$ = this._eventHandlerSource.asObservable();

  private _eventUserInfoSource = new BehaviorSubject<any>('');

  managedUserInfo$ = this._eventUserInfoSource.asObservable();

  private _userAvatarEvent = new BehaviorSubject<any>('');

  manageUserAvatar$ = this._userAvatarEvent.asObservable();

  private _eventUserFiler = new BehaviorSubject<any>('');

  managedUserFiler$ = this._eventUserFiler.asObservable();

  private _eventLoading = new BehaviorSubject<any>('');

  loading$ = this._eventLoading.asObservable();

  private _eventQuery = new BehaviorSubject<any>('');

  query$ = this._eventQuery.asObservable();

  set eventUserInfoSource(value: BehaviorSubject<any>) {
    this._eventUserInfoSource = value;
  }

  constructor() {}

  pushUser(event) {
    this._eventHandlerSource.next(event);
  }

  ////////////

  pushUserInfo(event) {
    this._eventUserInfoSource.next(event);
  }
  ////////

  pushUserAvatar(avatar) {
    this._userAvatarEvent.next(avatar);
  }

  pushUserFiler(event) {
    this._eventUserFiler.next(event);
  }
  //////

  pushLoadingFilter(event) {
    this._eventLoading.next(event);
  }
  ///

  pushQuery(event) {
    this._eventQuery.next(event);
  }
}
