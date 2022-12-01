import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventCollectorService } from "shared/services/event-collector/event-collector.service";
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, OnDestroy {
  subscribeOnUserInfo: Subscription;

  public routeWay: Array<string> = ['/dashboard'];

  constructor(public event: EventCollectorService, public translate: TranslateService) {}

  ngOnInit() {
    this.translate.use(this.translate.getBrowserLang());
    this.subscribeOnUserInfo = this.event.managedUserInfo$.subscribe((user) => {
      if (user) {
        // tslint:disable-next-line:no-unused-expression
        user.permissions.includes('prebidUserWbid') ?
          (this.routeWay = ['/wbid/analytics-charts'])
          : this.routeWay;
        // tslint:disable-next-line:no-unused-expression
        user.permissions.includes('postbidUserWbid') && user.permissions.includes('prebidUserWbid') ?
          (this.routeWay = ['/dashboard'])
          : this.routeWay;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscribeOnUserInfo !== undefined) { this.subscribeOnUserInfo.unsubscribe(); }

  }
}
