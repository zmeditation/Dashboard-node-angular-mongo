import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { PublishersAnalyticsForThirtyDays } from '../../statistics-services/publishers-analytics-for-thirty-days.service';
import { TAnalyticsData } from '../../../../../../shared/interfaces/statistic.interface';
import { egretAnimations } from '../../../../../../shared/animations/egret-animations';

@Component({
  selector: 'app-statistics-worst-publishers',
  templateUrl: './statistics-worst-publishers.component.html',
  styleUrls: ['./statistics-worst-publishers.component.scss'],
  animations: egretAnimations
})
export class StatisticsWorstPublishersComponent implements OnInit, OnDestroy {

  public dataSource = new MatTableDataSource();

  public displayedColumnsWorst = ['publishers', 'percent_fall'];

  public worstPublishers = [];

  public noData: boolean;

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

    this.worstPublishers = JSON.parse(JSON.stringify(analytics));
    this.resultPercentGrowth(this.worstPublishers);
    this.setLimit(this.worstPublishers);
    this.noData = this.worstPublishers.length ? false : true;
    this.dataSource = new MatTableDataSource(this.worstPublishers);
  }

  resultPercentGrowth(arr) {
    const percentArr = [];
    const filteredArr = arr
      .map((el) => {
        let sumOfRevenue = 0;
        el.analytics.forEach((item, inx) => {
          sumOfRevenue += parseFloat(item.revenue);
        });
        if (sumOfRevenue > 10) { return el; }

      })
      .filter((el) => el !== undefined);

    filteredArr.forEach((el) => {
      el.analytics.splice(0, el.analytics.length - 7);
      percentArr[filteredArr.indexOf(el)] = {
        name: el.name,
        growth: []
      };
      for (const i of el.analytics) { percentArr[filteredArr.indexOf(el)].growth.push(+i.revenue); }

    });
    this.formulaPercent(percentArr);
  }

  formulaPercent(arr) {
    for (const obj of arr) {
      obj.percent_fall = [];
      obj.growth.forEach((el, i, all) => {
        if (all[i - 1] === undefined) { return; }
        if (all[i - 1] === 0 && el !== 0) {
          el = 100;
          obj.percent_fall.push(el);
          return;
        }
        el = Math.round(((el / all[i - 1]) * 100 - 100) * 100) / 100;
        if (!isFinite(el)) { el = 0; }

        obj.percent_fall.push(el);
      });
      obj.percent_fall = Math.round(
        (obj.percent_fall.reduce((acc, next) => {
          return acc + next;
        }) /
          obj.growth.length) *
          -1
      );
    }
    this.worstPublishers = arr.filter((el) => el.percent_fall !== 0);

    this.worstPublishers.sort((a, b) => {
      if (a.percent_fall < b.percent_fall) { return 1; }
      if (a.percent_fall > b.percent_fall) { return -1; }
    });
  }

  setLimit(arr) {
    return arr.splice(5, arr.length - 5);
  }

  ngOnDestroy(): void {
    if (this.subscriptions) { this.subscriptions.unsubscribe(); }
  }
}
