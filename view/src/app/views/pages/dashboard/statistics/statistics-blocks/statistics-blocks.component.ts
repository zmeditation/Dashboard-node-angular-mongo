import { Component, OnInit, OnDestroy } from "@angular/core";
import { PublishersAnalyticsForThirtyDays } from '../statistics-services/publishers-analytics-for-thirty-days.service';
import { egretAnimations } from '../../../../../shared/animations/egret-animations';
import { PublishersAnalyticInterface } from '../../../../../shared/interfaces/statistic.interface';


@Component({
  selector: "app-statistics-blocks",
  templateUrl: "./statistics-blocks.component.html",
  styleUrls: ["./statistics-blocks.component.scss"],
  animations: egretAnimations
})
export class StatisticsBlocksComponent implements OnInit, OnDestroy {

  protected services: PublishersAnalyticInterface[] = [];

  constructor(
    protected pubsAnalyticsThirtyDaysService: PublishersAnalyticsForThirtyDays
  ) {
    this.services = [
      this.pubsAnalyticsThirtyDaysService
    ];
  }

  ngOnInit(): void {
    this.setServicesListeners();
  }

  protected setServicesListeners(): void {
    this.services.forEach(service => {
      service.watchPubsResults();
      service.socketConnectAndListen();
    });
  }

  protected unsubscribeServices(): void {
    this.services.forEach(service => {
      if (service.socket) {
        service.socket.removeListener('analytics');
      }

      if (service.subscriptions) {
        service.subscriptions.unsubscribe();
        service.subscriptions.closed = false;
      }

      if (!service.runCheckLastUpdate) {
        service.runCheckLastUpdate = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeServices();
  }
}
