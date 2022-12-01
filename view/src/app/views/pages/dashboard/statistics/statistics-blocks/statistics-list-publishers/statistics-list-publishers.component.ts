import { Component, ViewEncapsulation, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../../../../../environments/environment';
import { AnalyticsEndpointsService } from 'shared/services/cruds/analytics-endpoints.service';
import { TestUsersService } from 'shared/services/user/test-users.service';
import { egretAnimations } from 'shared/animations/egret-animations';

interface PublishersObj {
  _id: string;
  date_to_connect_am: Date;
  enabled: {
    changed: boolean;
    status: boolean;
  };
  hidden: boolean;
  name: string;
}

interface PubsOfManagersInterface {
  _id: string;
  manager: string;
  photo: any;
  publishers: PublishersObj[];
}

@Component({
  selector: 'app-statistics-list-publishers',
  templateUrl: './statistics-list-publishers.component.html',
  styleUrls: ['./statistics-list-publishers.component.scss'],
  animations: egretAnimations,
  encapsulation: ViewEncapsulation.None
})
export class StatisticsListPublishersComponent implements OnInit, OnDestroy {
  public publishersOfManagers = [];

  public publishersByRevenue = [];

  private revenueLoading = true;

  public revenueError = '';

  public notValidManagers = ['Vasiliy Doga', 'Maksym Pavlenko'];

  public delManagers = ['qa_sam', 'qa-am'];

  subscription = new Subscription();

  userImgFolder = environment.publicFolder + '/images/pp/';

  public dataSource = new MatTableDataSource();

  displayedColumns = ['manager', 'publishers'];

  public constructor(
    private analyticChartService: AnalyticsEndpointsService,
    protected testUsersService: TestUsersService
  ) { }

  ngOnInit() {
    this.dataOfManagersPubs();
    this.pubsRevenue();
  }

  dataOfManagersPubs() {
    this.revenueLoading = true;

    this.subscription.add(
      this.analyticChartService.getPublishersOfAccountManagers().subscribe((data: any) => {
        this.publishersOfManagers = this.filterManagers(data.results, this.notValidManagers);

        this.subscription.add(
          this.testUsersService.testUsersStatistics.subscribe((result) => {
            const testUsers = result.map((user) => user.name);
            this.publishersOfManagers = this.publishersOfManagers.filter((user) => !testUsers.includes(user.manager));
            this.setTableData(this.publishersOfManagers);
            this.revenueLoading = false;
          })
        );
      })
    );
  }

  pubsRevenue() {
    const today = new Date();
    const monthLater = new Date();
    monthLater.setMonth(monthLater.getMonth() - 1);

    const query = {
      rangeForReports: {
        minDate: monthLater,
        maxDate: today
      },
      minSum: 30
    };

    this.subscription.add(
      this.analyticChartService.getApiPublishersRevenue(query).subscribe((data: any) => {
        const { pubsAndRevenues, error, success } = data;

        if (error !== null) {
          return (this.revenueError = 'Error to get sum of publishers revenue');
        }

        if (success === true) {
          this.publishersByRevenue = Object.keys(pubsAndRevenues);
          this.revenueError = '';
          this.setTableData(this.publishersOfManagers);
          this.revenueLoading = false;
        } else {
          this.setTableData(this.publishersOfManagers);
          this.revenueLoading = false;
        }
      })
    );
  }

  setTableData(fullData) {
    this.formattingPublisherByNameOnly(fullData);
    fullData = this.hiddenPubs(this.publishersOfManagers, this.publishersByRevenue);
    this.dataSource = new MatTableDataSource(fullData);
  }

  formattingPublisherByNameOnly(fullData) {
    for (const manager of fullData) {
      manager.publishers = manager.publishers
        .map((el) => {
          el.hidden = false;
          return el;
        })
        .sort((a) => {
          if (a.enabled.status === true) {
            return -1;
          }

          if (a.enabled.status === false) {
            return 1;
          }
        });
    }
  }

  hideDisabledPubs(pubs) {
    if (pubs.checked) {
      this.publishersOfManagers = this.hiddenPubs(this.publishersOfManagers, this.publishersByRevenue);
      this.dataSource = new MatTableDataSource(this.publishersOfManagers);
    } else if (!pubs.checked) {
      this.publishersOfManagers = this.publishersOfManagers.map((pub) => {
        pub.publishers = pub.publishers.map((el) => {
          el.hidden = false;
          return el;
        });
        return pub;
      });

      this.dataSource = new MatTableDataSource(this.publishersOfManagers);
    }
  }

  hiddenPubs(publishersArr: PubsOfManagersInterface[], pubHasRevenue): PubsOfManagersInterface[] {
    return publishersArr.map((pub: PubsOfManagersInterface) => {
      pub.publishers = pub.publishers.map((el: PublishersObj) => {
        el.hidden = !((pubHasRevenue.length > 0 && pubHasRevenue.includes(el.name) && el.enabled.status) ||
          (pubHasRevenue.length === 0 && el.enabled.status));
        return el;
      });
      return pub;
    });
  }

  filterManagers(managers: PubsOfManagersInterface[], notValidManagers): PubsOfManagersInterface[] {
    let pubForNoManager = [];

    const managersArr = managers
      .map((obj: PubsOfManagersInterface) => {
        if (notValidManagers.includes(obj.manager.trim())) {
          pubForNoManager = [...pubForNoManager, ...obj.publishers];
          obj.publishers = [];
        }
        return obj;
      })
      .filter((obj) => !this.delManagers.includes(obj.manager));

    managersArr.forEach((obj: PubsOfManagersInterface) => {
      if (obj.manager === 'No manager') {
        obj.publishers.push(...pubForNoManager);
      }
    });

    return managersArr;
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}
