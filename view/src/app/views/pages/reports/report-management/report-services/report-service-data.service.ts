import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceDataService {
  private _propertyHandler = new Subject<any>();

  property = this._propertyHandler.asObservable();

  private _statusHandler = new Subject<any>();

  status = this._statusHandler.asObservable();

  constructor() {}

  sendProperty(placementObject) {
    this._propertyHandler.next(placementObject);
  }

  sendStatus(status) {
    this._statusHandler.next(status);
  }
}
