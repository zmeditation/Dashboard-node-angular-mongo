import { Component, Input, OnChanges, OnDestroy, ViewChild, AfterViewInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { TestUsersService } from 'shared/services/user/test-users.service';
import { egretAnimations } from 'shared/animations/egret-animations';
import { TestUserType } from 'shared/types/users';
import { ManagerRevenueObject } from 'shared/types/reports';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-analytic-table',
  templateUrl: './analytic-table.component.html',
  styleUrls: ['./analytic-table.component.scss'],
  animations: egretAnimations
})

export class AnalyticTableComponent implements OnChanges, AfterViewInit, OnDestroy {
  private subscriptions = new Subscription();

  public displayedColumns: string[] = ['Account Manager', 'Revenue'];

  private totalSum: number;

  public userImgFolder: string = environment.publicFolder + '/images/pp/';

  public dataAboutAccountsRevenue: ManagerRevenueObject[] = [];

  public managersDataBase: MatTableDataSource<ManagerRevenueObject> = new MatTableDataSource(this.dataAboutAccountsRevenue);

  @Input() dataBaseSet: any;

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(protected testUsersService: TestUsersService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataAboutAccountsRevenue = changes.dataBaseSet.currentValue;
    this.managersDataBase = new MatTableDataSource(this.dataAboutAccountsRevenue);
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      this.testUsersService.testUsersStatistics.subscribe((result: TestUserType[]) => {
        const testUsers = result.map((user) => user.name);
        this.dataAboutAccountsRevenue = this.dataAboutAccountsRevenue.filter((el) => !testUsers.includes(el.account.name));
        this.managersDataBase = new MatTableDataSource(this.dataAboutAccountsRevenue);
      })
    );
  }

  getTotalCost(): number {
    return (this.totalSum = this.managersDataBase.data
      .map((t) => t.revenue)
      .reduce((acc, value) => acc + value, 0));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
