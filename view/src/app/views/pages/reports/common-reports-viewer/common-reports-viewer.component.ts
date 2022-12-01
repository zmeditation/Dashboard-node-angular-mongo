import { Component, OnDestroy, OnInit } from '@angular/core';
import { egretAnimations } from 'shared/animations/egret-animations';
import { Subscription } from 'rxjs';
import { ReportsService } from '../../../../wmg_modules/statistics/tables/reports-builder/services/reports.service';
import { EventCollectorService } from "shared/services/event-collector/event-collector.service";
import { User } from "shared/interfaces/users.interface";
import { ROLES } from 'shared/interfaces/roles.interface';

@Component({
  selector: 'app-common-reports-viewer',
  templateUrl: './common-reports-viewer.component.html',
  styleUrls: ['./common-reports-viewer.component.scss'],
  animations: egretAnimations
})
export class CommonReportsViewerComponent implements OnInit, OnDestroy {
  protected types: string[] = ['TAC', 'main', 'WBID', 'oRTB'];

  public selected = 'main';

  public user: User;

  protected subscriptions: Subscription = new Subscription();

  public constructor(
    protected reportsService: ReportsService,
    protected event: EventCollectorService
  ) {
  }

  ngOnInit(): void {
    this.getUserData();
    this.getReportType();
  }

  getUserData(): void {
    const userSub = this.event.managedUserInfo$.subscribe((user: User) => {
      this.user = user;
      if (user.role === ROLES.PARTNER || user.adWMGAdapter === true) {
        this.selected = 'oRTB';
      }
    });
    this.subscriptions.add(userSub);
  }

  getReportType(): void {
    const reportTypeSub = this.reportsService.type.subscribe((resp: string) => {
      if (this.types.includes(resp)) {
        this.selected = resp;
      }
    });
    this.subscriptions.add(reportTypeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
