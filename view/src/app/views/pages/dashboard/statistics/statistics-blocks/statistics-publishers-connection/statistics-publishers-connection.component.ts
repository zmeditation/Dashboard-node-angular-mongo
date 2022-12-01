import { OnInit, Component, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { TPublishersCountByMonth, TPublishersStatisticsMonths } from '../../../../../../shared/interfaces/statistic.interface';
import { egretAnimations } from '../../../../../../shared/animations/egret-animations';
import { MatDialog } from '@angular/material/dialog';
import { AnalyticsEndpointsService } from '../../../../../../shared/services/cruds/analytics-endpoints.service';
import { ConnectionDialog } from './connection-dialog/connection-dialog.component';

@Component({
  selector: 'app-statistics-publishers-connection',
  templateUrl: './statistics-publishers-connection.component.html',
  styleUrls: ['./statistics-publishers-connection.component.scss'],
  animations: egretAnimations
})
export class StatisticsPublishersConnectionComponent implements OnInit, OnDestroy {
  public displayedColumnsTop = ['month', 'created', 'earned'];

  public publishersCountByMonth: TPublishersStatisticsMonths;

  public dataSourceTop: MatTableDataSource<TPublishersCountByMonth> = new MatTableDataSource();

  public failureMessage = '';

  public currentYear: number;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private analiticsS: AnalyticsEndpointsService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getDataForDesk();
    this.currentYear = new Date().getFullYear();
  }

  openDialog(publisherNames: string[], column: string): void {
    if (!publisherNames || !publisherNames?.length) { return; }

    this.dialog.open(ConnectionDialog, {
      width: 'max-content',
      data: {
        publisherNames,
        header: column
      }
    });
  }

  private getDataForDesk() {
    this.failureMessage = '';

    const pubCountSub = this.analiticsS.getPublishersCountByMonth()
      .subscribe(({ publishersCountByMonth }) => {
        this.publishersCountByMonth = publishersCountByMonth;
        this.setPubsInTable();
      },
      (error) => {
        this.publishersCountByMonth = null;
        this.failureMessage = error.msg;
      }
      );
    this.subscriptions.add(pubCountSub);
  }

  private setPubsInTable() {
    if (!this.publishersCountByMonth) { return; }

    const pubsArray: TPublishersCountByMonth[] = [];
    for (const [month, analytics] of Object.entries(this.publishersCountByMonth)) {
      pubsArray.push({
        month,
        created: analytics.created,
        earned: analytics.earned
      });
    }

    const currentMonthNumber = this.getCurrentMonthNumber();
    const monthsGetPubsCount: TPublishersCountByMonth[] = pubsArray.slice(0, currentMonthNumber + 1);
    this.dataSourceTop = new MatTableDataSource(monthsGetPubsCount);
  }

  protected getCurrentMonthNumber(): number {
    return new Date().getMonth();
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
