import moment from 'moment';
import Validator from 'shared/utils/validator';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { UsersEndpointsService } from 'shared/services/cruds/users-endpoints.service';
import { CountReportsEndpointsService } from 'shared/services/cruds/count-reports-endpoints.service';
import { ReportsEndpointsService } from 'shared/services/cruds/reports-endpoins.service';
import { IMatAutocompletePaginationData } from 'shared/components/mat-autocomplete-pagination/interfaces/mat-autocomplete-pagination-data';
import { egretAnimations } from 'shared/animations/egret-animations';
import { PageCacheService } from 'shared/utils/cache/page';

@Component({
  selector: 'app-reports-users-tools',
  templateUrl: './reports.component.html',
  styleUrls: ['reports.component.scss'],
  animations: egretAnimations
})
export class ReportsUsersToolsComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  protected pageCacheService = new PageCacheService();

  public displayedColumns = ['field', 'value', 'actions'];

  public expandedElement: any;

  public disabledLoadMoreButton = false;

  public usersData: IMatAutocompletePaginationData = {
    list: [],
    pagination: { page: 1, total: 0 }
  };

  public isLoadingPublishers = false;

  public isLoadingUserData = false;

  public isLoadingReportsData = false;

  public isLoadingSyncAction = false;

  public totalUsersListRows = 0;

  public searchUserValue = new FormControl();

  protected temporarySearch = '';

  public selectedUserId = '';

  protected currentUserId = '';

  protected countsReportsUserId = '';

  protected readonly fieldsGetUsersRequestParameter = ['id', 'name', 'email', 'commission', 'enabled', 'am', 'dateToConnectAM'];

  protected readonly userFieldsSettings = [
    { translationKey: 'NAME', field: 'name', sync: false, syncType: '' },
    { translationKey: 'EMAIL', field: 'email', sync: false, syncType: '' },
    { translationKey: 'COMMISSION_NUMBER', field: 'commission.commission_number', sync: false, syncType: '' },
    { translationKey: 'COMMISSION_TYPE', field: 'commission.commission_type', sync: false, syncType: '' },
    { translationKey: 'COUNT_OF_REPORTS', field: 'countOfReports', sync: false, syncType: '' },
    { translationKey: 'STATUS', field: 'enabled.status', sync: false, syncType: '' },
    { translationKey: 'AM', field: 'am', sync: true, syncType: 'accountManagerSync' },
    { translationKey: 'DATE_TO_CONNECT_AM', field: 'dateToConnectAM', sync: false, syncType: '' }
  ];

  public userInformation = [];

  public programmaticsReportsCountsData = [];

  public userTotalReportsCount = 0;

  protected readonly defaultSortRule = 'name:asc';

  protected readonly defaultSortRuleRequestInclude = [
    {
      key: 'enabled.status',
      value: true,
      extraValue: false
    }
  ];

  protected readonly limit = 20;

  protected readonly step = 3;

  protected indent = 0;

  protected usersListPage = 1;

  protected usersListPageExtra = 1;

  protected nextPageIndexUpdateUsersList = 4;

  protected eachPageUpdate = 3;

  public constructor(
    protected translate: TranslateService,
    protected snack: MatSnackBar,
    protected usersEndpointsService: UsersEndpointsService,
    protected countReportsEndpointsService: CountReportsEndpointsService,
    protected reportsEndpointsService: ReportsEndpointsService
  ) {
    this.pageCacheService.setIdItemProperty('id').setPageLimit(this.limit);
  }

  public ngOnInit(): void {}

  public loadUsers(): void {
    if (!this.isLoadingPublishers) {
      this.isLoadingPublishers = true;
      this.subscriptions.add(
        this.usersEndpointsService.getList(this.getUsersPaginationParameters()).subscribe(
          (response) => {
            this.handleLoadUsersSuccessResponse(response.data);
          },
          (response) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const error = response.error;
          }
        )
      );
    }
  }

  protected getUsersPaginationParameters() {
    return {
      roles: 'PUBLISHER',
      sort: this.defaultSortRule,
      page: this.indent ? this.usersListPageExtra.toString() : this.usersListPage.toString(),
      limit: this.limit.toString(),
      step: this.step.toString(),
      include: JSON.stringify(this.defaultSortRuleRequestInclude),
      fields: this.fieldsGetUsersRequestParameter.join(','),
      indent: this.indent.toString()
    };
  }

  public searchUser({ target: { value } }): void {
    value = value.trim();

    if (value) {
      this.disabledLoadMoreButton = true;
      const cacheSearchResult = this.cacheSearch(value);

      if (cacheSearchResult) {
        this.temporarySearch = '';
      } else {
        this.isLoadingPublishers = true;
        this.usersData.list = [];
        this.serverSearch(value);
      }
    } else {
      this.isLoadingPublishers = false;
      this.disabledLoadMoreButton = false;
      this.usersData.list = this.pageCacheService.getAllItems();
    }
  }

  protected cacheSearch(value: string): boolean {
    const cacheSearchResult = this.pageCacheService.search({
      value,
      by: 'name'
    });

    if (cacheSearchResult.length) {
      this.usersData.list = cacheSearchResult;

      return true;
    }

    return false;
  }

  protected serverSearch(value: string): void {
    this.temporarySearch = value;

    setTimeout(() => {
      if (value && value === this.temporarySearch) {
        this.subscriptions.add(
          this.usersEndpointsService
            .getList({
              search: JSON.stringify({value, by: 'name' }),
              page: '1',
              limit: this.limit.toString(),
              step: '1',
              fields: this.fieldsGetUsersRequestParameter.join()
            })
            .subscribe(
              (response) => {
                this.isLoadingPublishers = false;
                // @ts-ignore
                this.usersData.list = response.data.users;
              },
              (response) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const error = response.error;
              }
            )
        );
      }
    }, 1500);
  }

  public loadMoreUsers(): void {
    this.usersListPage++;

    if (this.nextPageIndexUpdateUsersList <= this.usersListPage && !this.isFullUsers()) {
      this.nextPageIndexUpdateUsersList += this.eachPageUpdate;

      this.loadUsers();
    } else {
      this.usersData.list = this.pageCacheService.getItemsFromFirstPage(this.usersListPage).items;
    }
  }

  protected isFullUsers(): boolean {
    return this.totalUsersListRows <= this.pageCacheService.count();
  }

  protected handleLoadUsersSuccessResponse(data: any): void {
    this.pageCacheService.addItems(data.users);
    this.usersData.list = this.pageCacheService.getItemsFromFirstPage(this.usersListPage).items;
    this.totalUsersListRows = data.totalRows;
    this.usersData.pagination.total = data.totalRows;
    this.usersListPageExtra = this.indent ? this.usersListPageExtra + this.eachPageUpdate : 1;

    if (data.extra) {
      this.defaultSortRuleRequestInclude[0].value = false;
      this.indent = data.extra.indent;
    }

    this.isLoadingPublishers = false;
  }

  public selectUser(data: { id: string; value: string }): void {
    this.selectedUserId = data.id;

    if (this.temporarySearch) {
      const item = this.usersData.list.filter((user) => user.id === data.id)[0];

      this.pageCacheService.addItem(item);
      this.temporarySearch = '';
    }

    this.usersData.list = this.pageCacheService.getItemsFromFirstPage(this.usersListPage).items;
  }

  public showUserData(): void {
    if (this.selectedUserId) {
      this.isLoadingUserData = true;
      this.currentUserId = this.selectedUserId;

      const user = this.pageCacheService.search({
        value: this.selectedUserId,
        by: 'id'
      })[0];

      if (user.am && Validator.mongoDBId(user.am)) {
        this.subscriptions.add(
          this.usersEndpointsService.getUser(user.am, { fields: 'name' }).subscribe(
            (response) => {
              user.am = response.user.name;

              this.fillUserInformation(user);
            },
            (response) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const error = response.error;

              user.am = null;

              this.fillUserInformation(user);
            }
          )
        );
      } else {
        this.fillUserInformation(user);
      }
    }
  }

  protected loadCountReports(): void {
    this.isLoadingReportsData = true;
    this.countsReportsUserId = this.currentUserId;

    this.subscriptions.add(
      this.countReportsEndpointsService.getCountOfReportsTotalAndProgrammatics(this.currentUserId).subscribe(
        (response) => {
          this.programmaticsReportsCountsData = response.data.byProgrammatics;
          this.userTotalReportsCount = response.data.total;

          this.isLoadingReportsData = false;
        },
        (response) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const error = response.error;
          this.isLoadingReportsData = false;
        }
      )
    );
  }

  protected fillUserInformation(user: any): void {
    const userInfo = [];

    for (const setting of this.userFieldsSettings) {
      const valueArrayPath = setting.field.split('.');
      let value = valueArrayPath.length === 2 ? user[valueArrayPath[0]][valueArrayPath[1]] : user[valueArrayPath[0]];
      const row: any = {
        translationKey: setting.translationKey,
        field: setting.field,
        syncType: setting.syncType
      };

      if (value || setting.field === 'enabled.status' || setting.field === 'countOfReports') {
        if (setting.field === 'dateToConnectAM') {
          value = moment(value).format('MM/DD/YYYY');
        }

        if (setting.field === 'countOfReports') {
          value = '';
        }

        row.value = value;
      } else {
        row.value = 'none';
      }

      const sync = setting.sync && setting.syncType === 'accountManagerSync' && row.value !== 'none';
      row.sync = sync;

      userInfo.push(row);
    }

    this.userInformation = userInfo;
    this.isLoadingUserData = false;
  }

  public syncEvent(type: string): void {
    this.isLoadingSyncAction = true;
    this[type]();
  }

  protected accountManagerSync(): void {
    this.subscriptions.add(
      this.reportsEndpointsService.updatePublisherAccountManager(this.currentUserId).subscribe(
        (response) => {
          this.isLoadingSyncAction = false;

          const snackConfig = new MatSnackBarConfig();
          snackConfig.duration = 100000;

          this.translate.get(`TOOLS.USERS_REPORTS.${ response.data.message }`).subscribe((message) => {
            this.snack.open(message, 'OK', snackConfig);
          });
        },
        (response) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const error = response.error;
          this.isLoadingSyncAction = false;
        }
      )
    );
  }

  public onExpandElement(element: { field: string }): void {
    if (element.field === 'countOfReports' && !this.isLoadingReportsData && this.currentUserId !== this.countsReportsUserId) {
      this.loadCountReports();
    }
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
