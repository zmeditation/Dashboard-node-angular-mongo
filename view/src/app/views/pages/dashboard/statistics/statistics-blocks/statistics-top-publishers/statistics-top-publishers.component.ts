import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { PublishersAnalyticsForThirtyDays } from '../../statistics-services/publishers-analytics-for-thirty-days.service';
import { TUserAnalytics, TPublishersRevenueSorted, TAnalyticsData } from '../../../../../../shared/interfaces/statistic.interface';
import { egretAnimations } from '../../../../../../shared/animations/egret-animations';

@Component({
  selector: 'app-statistics-top-publishers',
  templateUrl: './statistics-top-publishers.component.html',
  styleUrls: ['./statistics-top-publishers.component.scss'],
  animations: egretAnimations
})
export class StatisticsTopPublishersComponent implements OnInit, OnDestroy {

  public displayedColumnsTop = ['publishers', 'revenue'];

  protected dataSourceTop: MatTableDataSource<TPublishersRevenueSorted> = new MatTableDataSource();

  protected topPublishers: TUserAnalytics[] = [];

  protected topPublishersSorted: TPublishersRevenueSorted[] = [];

  private subscriptions: Subscription = new Subscription();

  constructor(
    private pubsAnalyticsThirtyDaysService: PublishersAnalyticsForThirtyDays
  ) {}

  ngOnInit() {
    this.watchChangePubsAnalytic();
  }

  protected watchChangePubsAnalytic(): void {
    const getPubsRes = this.pubsAnalyticsThirtyDaysService.deliveryPubsAnalytics
      .subscribe((data: TAnalyticsData) => this.setDataToDesks(data));

    this.subscriptions.add(getPubsRes);
  }

  protected setDataToDesks(data: TAnalyticsData): void {
    const analytics = data?.analytics;

    this.topPublishers = JSON.parse(JSON.stringify(analytics));
    this.topPublishersSorted = this.summOfRevenue(this.topPublishers);
    this.dataSourceTop = new MatTableDataSource(this.topPublishersSorted);
  }

  summOfRevenue(arr: TUserAnalytics[]): TPublishersRevenueSorted[] {
    const summArr: TPublishersRevenueSorted[] = [];
    let sortedPubRevenue: TPublishersRevenueSorted[] = [];

    arr.forEach((el: TUserAnalytics, idx) => {
      el.analytics.splice(0, el.analytics.length - 7);

      for (const i of el.analytics) {
        summArr[idx] === undefined ?
          (summArr[idx] = { name: el.name, revenue: +i.revenue })
          : (summArr[idx].revenue = summArr[idx].revenue + +i.revenue);
      }


      summArr[idx].revenue = Math.round(summArr[idx].revenue * 100) / 100;
    });

    sortedPubRevenue = summArr.sort((a, b) => {
      if (a.revenue < b.revenue) { return 1; }
      if (a.revenue > b.revenue) { return -1; }
    });

    return this.setLimit(sortedPubRevenue, 5);
  }

  setLimit(arr: TPublishersRevenueSorted[], limit: number): TPublishersRevenueSorted[] {
    const startFrom = 0;
    return arr.slice(startFrom, limit);
  }

  ngOnDestroy(): void {
    if (this.subscriptions) { this.subscriptions.unsubscribe(); }
  }
}
