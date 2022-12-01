import { Component, OnDestroy, OnInit } from '@angular/core';
import { FlashMessagesService } from '../../services/flash-messages.service';
import { egretAnimations } from '../../animations/egret-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flash-messages',
  templateUrl: './flash-messages.component.html',
  styleUrls: ['./flash-messages.component.scss'],
  animations: egretAnimations
})
export class FlashMessagesComponent implements OnInit, OnDestroy {
  showMessage = false;

  message: string;

  time: number;

  animPos = '-25px';

  showPrompt = false;

  private SubscriptionHandler: Subscription;

  public flashClasses: Array<any> = ['neutral'];

  public containerClasses: Array<any> = ['flash-top'];

  constructor(public flashService: FlashMessagesService) {}

  ngOnInit() {
    this.SubscriptionHandler = this.flashService.showFlashMessage$.subscribe((messageObj) => {
      if (messageObj === null) {
        return;
      }
      this.showFlash(messageObj);
    });
  }

  showFlash(obj) {
    this.flashClasses = [];
    this.containerClasses = [];

    if (obj.position) {
      if (obj.position === 'bottom') {
        this.containerClasses.push('flash-bottom');
        this.animPos = '25px';
      } else if (obj.position === 'center') {
        this.containerClasses.push('flash-prompt');
        this.animPos = '0';
      } else {
        this.containerClasses.push('flash-top');
        this.animPos = '-25px';
      }
    } else {
      this.containerClasses.push('flash-top');
    }

    if (obj.status) {
      this.flashClasses.push(this.getColorClass(obj.status));
    } else {
      this.flashClasses.push('neutral');
    }

    if (obj.message) {
      this.message = obj.message;
    } else {
      this.message = 'No message';
    }

    if (obj.time) {
      this.time = obj.time;
    } else {
      this.time = 3000;
    }

    this.showMessage = true;

    const time = setTimeout(() => {
      this.showMessage = false;
    }, this.time);

    if (obj.prompt) {
      this.showPrompt = true;
      clearTimeout(time);
    }
  }

  getColorClass(status) {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'neutral':
      default:
        return 'neutral';
    }
  }

  sendMessage(bool) {
    this.flashService.sendPrompt(bool);
    this.showPrompt = false;
    this.showMessage = false;
    this.showPrompt = false;
  }

  ngOnDestroy(): void {
    if (this.SubscriptionHandler !== undefined) {
      this.SubscriptionHandler.unsubscribe();
    }
  }
}
