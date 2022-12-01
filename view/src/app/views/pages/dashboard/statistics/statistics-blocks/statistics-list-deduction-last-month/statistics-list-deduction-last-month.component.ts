import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AnalyticsEndpointsService } from '../../../../../../shared/services/cruds/analytics-endpoints.service';
import { egretAnimations } from '../../../../../../shared/animations/egret-animations';
import { PubAndDedStatistic, SuccessResDedStatistic, UnSuccessResDedStatistic } from '../../../../../../shared/interfaces/statistic.interface';

@Component({
  selector: 'app-statistics-list-deduction-last-month',
  templateUrl: './statistics-list-deduction-last-month.component.html',
  styleUrls: ['./statistics-list-deduction-last-month.component.scss'],
  animations: egretAnimations
})
export class StatisticsListDeductionLastMonthComponent implements OnInit {
  subscribeHandler: Subscription;

  public displayedColumnsTop = ['publishers', 'sumOfDeduction'];

  public dataSourceTop: MatTableDataSource<PubAndDedStatistic> = new MatTableDataSource();

  public topDeduction: PubAndDedStatistic[] = [];

  public failureMessage = '';

  constructor(private service: AnalyticsEndpointsService) {}

  ngOnInit() {
    this.dataForDesks();
  }

  // Get calculated data of deduction sum for all time by everyone publishers
  dataForDesks() {
    this.failureMessage = '';
    const query = {
      sum: true,
      date: {
        range: 'lastMonth'
      }
    };

    this.subscribeHandler = this.service.getApiDeduction(query).subscribe(
      (data: SuccessResDedStatistic) => {
        if (data.success === true) {
          this.topDeduction = data.publisherDeductions;
          if (!this.topDeduction.length) { this.failureMessage = 'No data'; }
          this.dataSourceTop = new MatTableDataSource(this.topDeduction);
        }
      },
      (error: UnSuccessResDedStatistic) => {
        if (error.success === false) {
          this.topDeduction = [];
          this.failureMessage = error.msg;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscribeHandler !== undefined) { this.subscribeHandler.unsubscribe(); }

  }
}
