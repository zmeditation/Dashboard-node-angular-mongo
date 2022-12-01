import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Pipe({ name: 'notificationTime' })
export class NotificationTimePipe implements PipeTransform, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  private translateRes: string;

  constructor(private translate: TranslateService) {}

  transform(inputDate: Date | string) {
    if (!(inputDate instanceof Date)) { inputDate = new Date(inputDate); } 
    

    const seconds: number = Math.floor((new Date().getTime() - inputDate.getTime()) / 1000);
    const oneDay = 86400;
    const oneHour = 3600;
    const oneMinute = 60;

    const days: number = Math.floor(seconds / oneDay);
    if (days >= 1) { return inputDate.toLocaleString(); } 
    // "11/26/2020, 10:54:16 AM" example to returning date string
    

    const hours = Math.floor(seconds / oneHour);
    if (hours >= 1) { return this.runTranslateNotice('NOTIFICATIONS.TIME.HOURS_AGO', hours); } 
    

    const minutes = Math.floor(seconds / oneMinute);
    if (minutes >= 1) { return this.runTranslateNotice('NOTIFICATIONS.TIME.MINUTES_AGO', minutes); } 
    

    return this.runTranslateNotice('NOTIFICATIONS.TIME.LESS_THAN_MINUTE');
  }

  runTranslateNotice(translateString: string, value?: number) {
    const timeSub = this.translate.get(translateString, { value }).subscribe((res: string) => {
      this.translateRes = res;
    });
    this.subscriptions.add(timeSub);

    return this.translateRes;
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) { this.subscriptions.unsubscribe(); } 
    
  }
}
