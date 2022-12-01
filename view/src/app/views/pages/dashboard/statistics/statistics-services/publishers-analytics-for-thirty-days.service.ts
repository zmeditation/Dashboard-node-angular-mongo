import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AnalyticsEndpointsService } from 'shared/services/cruds/analytics-endpoints.service';
import { PublishersAnalyticInterface, TAnalyticsData } from 'shared/interfaces/statistic.interface';
import { SocketDefault } from 'shared/services/socket.service';

@Injectable({
  providedIn: 'root'
})
export class PublishersAnalyticsForThirtyDays implements PublishersAnalyticInterface {

  public subscriptions: Subscription = new Subscription();

  public deliveryPubsAnalytics = new Subject<any>();

  public socket: SocketDefault = new SocketDefault();

  public runCheckLastUpdate = true;

  constructor(
    private analyticService: AnalyticsEndpointsService,
    // private socket: SocketDefault,
  ) {}

  public watchPubsResults(): void {
    const getPubsAnSub = this.analyticService.getPubsAnalyticsLastThirtyDays()
      .subscribe((data: TAnalyticsData) => this.checkLastUpdate(data));

    this.subscriptions.add(getPubsAnSub);
  }

  protected checkLastUpdate(data: TAnalyticsData): void {
    const lastUpdate = data?.last_update;
    const defaultLastUpdateInMs = new Date(2020, 1).getTime();

    if (!lastUpdate) {
      console.error('Not passed lastUpdate');
    }
    if (!this.runCheckLastUpdate) {
      console.error('checkLastUpdate use again');
      return;
    }
    this.runCheckLastUpdate = false;

    const oneHourInMs = 3600000;
    const oneHoureInMin = 60;
    const UTCTimezone = (new Date().getTimezoneOffset() / oneHoureInMin) * oneHourInMs; // -10800000 ms (3 hours) for UA
    const correctLastTime = (typeof lastUpdate === 'number')
      ? new Date(lastUpdate).getTime()
      : defaultLastUpdateInMs;
    const lastUpdateInMs = correctLastTime + UTCTimezone;
    const nowTimeInMs = new Date().getTime() + UTCTimezone;
    const eightHoursInMs = oneHourInMs * 8;

    if ((nowTimeInMs - lastUpdateInMs) >= eightHoursInMs) {
      const getNewPubsRes = this.analyticService.updatePubsAnalyticsLastThirtyDays()
        .subscribe((newData: TAnalyticsData) => this.sendDataForListeners(newData));

      this.subscriptions.add(getNewPubsRes);
      // Можно сделать оповещение про обновление данных
      return;
    }

    this.sendDataForListeners(data);
  }

  protected sendDataForListeners(data: TAnalyticsData): void {
    try {
      const analytics = data?.analytics;

      // eslint-disable-next-line no-throw-literal
      if (!Array.isArray(analytics)) { throw 'analytics is not array' }
      // eslint-disable-next-line no-throw-literal
      if (!analytics.length) { throw 'analytics is empty array' }

      this.deliveryPubsAnalytics.next(data);
    } catch (error) {
      console.error(error);
      this.deliveryPubsAnalytics.error(error);
    }
  }

  public socketConnectAndListen(): void {
    
    const getSocketMsgSub = this.socket
      .fromEvent('analytics')
      .subscribe((data: any) => {
        
        if (data.message === 'Publishers Analytics Updated Last Thirty Days') {
          const getPubsAnSub = this.analyticService.getPubsAnalyticsLastThirtyDays()
            .subscribe((newData: TAnalyticsData) => this.sendDataForListeners(newData));

          this.subscriptions.add(getPubsAnSub);
        }
      });

    this.subscriptions.add(getSocketMsgSub);
  }
}
