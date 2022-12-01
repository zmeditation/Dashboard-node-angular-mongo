import { Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { egretAnimations } from 'shared/animations/egret-animations';
import { EventCollectorService } from 'shared/services/event-collector/event-collector.service';
import { AnalyticsEndpointsService } from 'shared/services/cruds/analytics-endpoints.service';
import { GeneralStatistic } from 'shared/interfaces/statistic.interface';

enum BadgeColors {
  ACCENT = 'accent',
  WARN = 'warn',
}

@Component({
  selector: 'app-triplets',
  templateUrl: './triplets.component.html',
  styleUrls: ['./triplets.component.scss'],
  animations: egretAnimations
})
export class TripletsComponent implements OnInit, OnDestroy {
  @Input() userId: string;

  BadgeColorsType = BadgeColors

  loading: boolean;

  revenue = 0;
  averageCPM = 0;
  totalImpressions = 0;

  badgeColorObject = {
    revenue: BadgeColors.ACCENT,
    averageCPM: BadgeColors.ACCENT,
    totalImpressions: BadgeColors.ACCENT,
  };

  currentMonth?: GeneralStatistic;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private analyticsService: AnalyticsEndpointsService,
    private event: EventCollectorService,
  ) {}

  ngOnInit() {
    this.loading = true;
    this.subscriptions.add(
      this.event.managedUserInfo$.subscribe(({ permissions }) => {
        const prebidUserOnly = permissions.some(permission => 
          ['canSeeWBidIntegrationPage', 'canSeeWBidAnalyticsOnly'].includes(permission)
        );

        if (!prebidUserOnly) { 
          return this.getData(this.userId); 
        } 
        this.loading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getData(userId: string) {
    this.subscriptions.add(
      this.analyticsService.getMonthlyInfo(userId).subscribe(
        ({ result }) => {
          const { previousMonth } = result;
          this.currentMonth = result.currentMonth;

          this.totalImpressions = this.calculatePercent(previousMonth, this.currentMonth, 'totalImpressions');
          this.averageCPM = this.calculatePercent(previousMonth, this.currentMonth, 'averageCPM');
          this.revenue = this.calculatePercent(previousMonth, this.currentMonth, 'revenue');

          this.loading = false;
        },
        () => {
          this.loading = false;
        },
      )
    );
  }

  private calculatePercent(
    prev: GeneralStatistic, 
    cur: GeneralStatistic, 
    prop: keyof GeneralStatistic
  ): number {
    const prevValue = Number(cur[prop]);
    const curValue = Number(prev[prop]);

    if (!prevValue || !curValue) { 
      this.badgeColorObject[prop] = BadgeColors.ACCENT;
      return 0;
    }

    const result = (1 - prevValue / curValue) * 100;

    this.badgeColorObject[prop] = result < 0 
      ? BadgeColors.WARN 
      : BadgeColors.ACCENT;

    return result;
  }
}
