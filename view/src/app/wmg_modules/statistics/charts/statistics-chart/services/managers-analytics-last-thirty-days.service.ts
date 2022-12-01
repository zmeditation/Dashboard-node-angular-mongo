import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { SocketDefault } from 'shared/services/socket.service';
import { AnalyticsEndpointsService } from 'shared/services/cruds/analytics-endpoints.service';
import { TAnalyticsData } from 'shared/interfaces/statistic.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagersAnalyticsLastThirtyDays {

  public subscriptions: Subscription = new Subscription();

  public deliveryManagersAnalytics = new Subject<TAnalyticsData>();

  public socket: SocketDefault = new SocketDefault();

  public runCheckLastUpdate = true;

  constructor(private analyticService: AnalyticsEndpointsService) {}

  public watchManagersResults(): void {
    const getManagersSub = this.analyticService.getManagersAnalyticsLastThirtyDays()
      .subscribe(
        (data: TAnalyticsData) => this.checkLastUpdate(data),
        (error) => this.deliveryManagersAnalytics.error(error)
      );

    this.subscriptions.add(getManagersSub);
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
    const dayInMs = oneHourInMs * 24;

    if ((nowTimeInMs - lastUpdateInMs) >= dayInMs) {
      const getNewManagersRes = this.analyticService.updateManagersAnalyticsLastThirtyDays()
        .subscribe(
          (newData: TAnalyticsData) => this.sendDataForListeners(newData),
          (error) => this.deliveryManagersAnalytics.error(error)
        );

      this.subscriptions.add(getNewManagersRes);
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
      if (!analytics.length) { throw 'result is empty array' }

      this.deliveryManagersAnalytics.next(data);
    } catch (error) {
      console.error(error);
      this.deliveryManagersAnalytics.error(error);
    }
  }

  public socketConnectAndListen(): void {
    const getSocketMsgSub = this.socket
      .fromEvent('analytics')
      .subscribe((data: any) => {

        if (data.message === 'Managers Analytics Updated Last Thirty Days') {
          const getPubsAnSub = this.analyticService.getManagersAnalyticsLastThirtyDays()
            .subscribe(
              (newData: TAnalyticsData) => this.sendDataForListeners(newData),
              (error) => this.deliveryManagersAnalytics.error(error)
            );

          this.subscriptions.add(getPubsAnSub);
        }
      });

    this.subscriptions.add(getSocketMsgSub);
  }
}
