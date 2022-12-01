import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransporterService {

  private _messageHandler = new Subject<any>();

  message = this._messageHandler.asObservable();

  constructor() { }

  transit(value: any) {
    this._messageHandler.next(value);
  }
}
