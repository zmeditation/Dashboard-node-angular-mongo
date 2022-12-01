import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Subject } from 'rxjs';

/**
 * TODO: not working
 */
@Injectable()
export class FlashMessagesService {
  private _flashHandler = new BehaviorSubject<any>(null);

  showFlashMessage$ = this._flashHandler.asObservable();

  private _promptHandler = new Subject<any>();

  showPromptMessage$ = this._promptHandler.asObservable();

  constructor() {}

  sendPrompt(bool) {
    this._promptHandler.next(bool);
  }

  clearPrompt() {
    this._promptHandler.next();
  }

  clearFlash() {
    this._promptHandler.next();
    this._flashHandler.next(null);
  }

  flash(status: string, message: string, time: number, position?: string, prompt?: boolean) {
    const flashObj = {
      status,
      message,
      time,
      position,
      prompt
    };

    this._flashHandler.next(flashObj);
    this._promptHandler.next(prompt);
    // this.clearFlash()
  }
}
