import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { User } from "shared/interfaces/users.interface";
import { FILTER_IDS } from "../../../../wmg_modules/statistics/main-filter/filter-request-services/filter-request-ids";
import { Subscription } from "rxjs/Rx";
import { EventCollectorService } from "shared/services/event-collector/event-collector.service";
import { FilterRequestService } from "../../../../wmg_modules/statistics/main-filter/filter-request-services/filter-request.service";
import { Publisher } from "shared/interfaces/common.interface";

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent implements OnInit, OnDestroy {

  subscriptions: Subscription = new Subscription();

  @Output() publishersList: Publisher[];

  @Output() user: User;

  constructor(
    public event: EventCollectorService,
    public filterRequestService: FilterRequestService
  ) {
  }

  ngOnInit(): void {
    const getUserInfoSub = this.event.managedUserInfo$
      .subscribe((currentUser: User) => {
        this.user = currentUser;

        if (currentUser.role !== 'PUBLISHER') {
          const getAllPubsSub = this.filterRequestService
            .getFilterResultsById(FILTER_IDS.PUBLISHER)
            .subscribe((data) => {
              this.publishersList = data.results;
            });

          this.subscriptions.add(getAllPubsSub);
        }
      });

    this.subscriptions.add(getUserInfoSub)
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
