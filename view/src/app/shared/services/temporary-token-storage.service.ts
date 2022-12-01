import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemporaryTokenStorageService {
  private _publisherViewToken: string = '';
  private publisherViewExpirationTime?: number;
  
  set publisherViewToken(token: string) {
    this._publisherViewToken = token;
    this.publisherViewExpirationTime = Date.now() + 3 * 60 * 60 * 1000;
  }

  get publisherViewToken() {
    if (Date.now() > this.publisherViewExpirationTime) {
      this._publisherViewToken = '';
    }
    return this._publisherViewToken;
  }

  constructor() { }
}
