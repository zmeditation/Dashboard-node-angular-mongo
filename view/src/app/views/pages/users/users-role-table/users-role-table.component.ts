import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UsersEndpointsService } from 'shared/services/cruds/users-endpoints.service';
import { egretAnimations } from 'shared/animations/egret-animations';
import { UserGetUsersResponseType as User } from 'shared/services/cruds/types';
import { PageCacheService } from 'shared/utils/cache/page';
import { TableSortSettings } from './types';

@Component({
  selector: 'app-users-role-table',
  templateUrl: './users-role-table.component.html',
  styleUrls: ['./users-role-table.component.scss'],
  animations: egretAnimations
})
export class UsersRoleTableComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  protected pageCacheService = new PageCacheService();

  protected defaultSortRule = 'name:asc';

  protected defaultSortRuleRequestInclude = [
    {
      key: 'enabled.status',
      value: true,
      extraValue: false
    }
  ];

  protected defaultSortRuleExtraIndent = 0;

  protected defaultSortRuleExtraPage = 1;

  protected sort: TableSortSettings = { field: '', direction: '' };

  @Input()
  public role: string;

  @Output()
  public loading = new EventEmitter();

  @Output()
  public editUser = new EventEmitter();

  @Output()
  public deleteUser = new EventEmitter();

  @Output()
  public properties = new EventEmitter();

  @Output()
  public details = new EventEmitter();

  public pageIndex = 0;

  public paginatorTotalRows = 0;

  protected nextPageIndexUpdateTable = 5;

  protected eachPageUpdate = 5

  public pageSizeOptions = [10];

  // table
  public displayedColumns = ['name', 'email', 'role', 'status', 'actions'];

  // table data
  protected totalRows = 0;

  public tableData: User[] = [];

  public isLoadingResults = true;

  public constructor(protected usersEndpoints: UsersEndpointsService, protected translate: TranslateService, protected snack: MatSnackBar) {
    this.pageCacheService.setIdItemProperty('id').setPageLimit(this.pageSizeOptions[0]);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.usersEndpoints.getList(this.getInitGetUsersSettings).subscribe(
        (response) => {
          const data = response.data;

          this.paginatorTotalRows = data.totalRows;
          this.totalRows = data.totalRows;

          this.tableData = this.pageCacheService.addItems(data.users).getItemsByPage(0).items;

          this.toggleLoading();
        },
        (_error) => {
          this.subscriptions.push(
            this.translate.get('USERS_PAGE.USERS_TABLE.ERRORS.LOAD_USERS').subscribe((message: string) => {
              this.snack.open(message, 'ok', { duration: 10000 });
            })
          );
          this.toggleLoading();
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected get getInitGetUsersSettings(): any {
    return {
      roles: this.role,
      sort: this.defaultSortRule,
      page: '1',
      limit: this.pageSizeOptions[0].toString(),
      step: this.eachPageUpdate.toString(),
      include: JSON.stringify(this.defaultSortRuleRequestInclude)
    };
  }

  public changePage(event: any) {
    if (this.nextPageIndexUpdateTable <= event.pageIndex && !this.isFullTable()) {
      this.toggleLoading();

      this.nextPageIndexUpdateTable += this.eachPageUpdate;

      const getUsersRequestParameters = this.sort.field
        ? {
          roles: this.role,
          sort: `${this.sort.field}:${this.sort.direction}`,
          page: (event.pageIndex + 1).toString(),
          limit: this.pageSizeOptions[0].toString(),
          step: this.eachPageUpdate.toString()
        }
        : {
          roles: this.role,
          sort: this.defaultSortRule,
          page: this.defaultSortRuleExtraIndent ? this.defaultSortRuleExtraPage : (event.pageIndex + 1).toString(),
          limit: this.pageSizeOptions[0].toString(),
          step: this.eachPageUpdate.toString(),
          include: JSON.stringify(this.defaultSortRuleRequestInclude),
          indent: this.defaultSortRuleExtraIndent.toString()
        };

      this.subscriptions.push(
        this.usersEndpoints.getList(getUsersRequestParameters).subscribe(
          (response) => {
            const data = response.data;

            this.pageCacheService.addItems(data.users);
            this.tableData = this.pageCacheService.getItemsByPage(event.pageIndex).items;
            this.defaultSortRuleExtraPage = this.defaultSortRuleExtraIndent ? this.defaultSortRuleExtraPage + this.eachPageUpdate : 1;

            if (data.extra) {
              this.defaultSortRuleRequestInclude[0].value = false;
              this.defaultSortRuleExtraIndent = data.extra.indent;
            }

            this.toggleLoading();
          },
          (_error) => {
            this.subscriptions.push(
              this.translate.get('USERS_PAGE.USERS_TABLE.ERRORS.LOAD_USERS').subscribe((message: string) => {
                this.snack.open(message, 'ok', { duration: 10000 });
              })
            );
            this.toggleLoading();
          }
        )
      );
    } else {
      this.tableData = this.pageCacheService.getItemsByPage(event.pageIndex).items;
    }
  }

  public search({ value, type }: { value: string; type: string }): void {
    this.pageIndex = 0;

    const isDomainSearchType = type === 'domain';

    if (!isDomainSearchType) {
      this.pageCacheService.setSearchValue(value);
    }

    if (!value) {
      const pageData = this.pageCacheService.getItemsByPage(this.pageIndex);
      this.tableData = pageData.items;
      this.paginatorTotalRows = this.totalRows;
      return;
    }

    if (isDomainSearchType) {
      return this.searchAll({ value, type }, true);
    }

    const pageData = this.pageCacheService
      .setSearchBy(type)
      .getItemsByPage(this.pageIndex);

    this.tableData = pageData.items;
    this.paginatorTotalRows = pageData.totalItemsLength;

    this.searchAll({ value, type });
  }

  protected searchAll(
    { value, type }: { value: string; type: string },
    withRole?: boolean, 
    page: number = 0,
  ): void {
    if (!this.isLoadingResults) {
      this.toggleLoading();
    }

    this.subscriptions.push(
      this.usersEndpoints
        .getList({
          ...withRole && { roles: this.role },
          search: JSON.stringify({ value, by: type }),
          limit: this.pageSizeOptions[0].toString(),
          step: this.eachPageUpdate.toString()
        })
        .subscribe(({ data }) => {
          ({ 
            totalItemsLength: this.paginatorTotalRows,
            items: this.tableData,
          } = this.pageCacheService.addItems(data.users, [value]).getItemsByPage(page));

          if (this.isLoadingResults) {
            this.toggleLoading();
          }
        },
        (_error) => {
          this.subscriptions.push(
            this.translate.get('USERS_PAGE.USERS_TABLE.ERRORS.LOAD_USERS').subscribe((message: string) => {
              this.snack.open(message, 'ok', { duration: 10000 });
            })
          );

          if (this.isLoadingResults) {
            this.toggleLoading();
          }
        })
    );
  }

  public getAllUsers(): User[] {
    return this.pageCacheService.getAllItems();
  }

  protected editUserEvent(user: User): void {
    this.editUser.emit(user);
  }

  protected deleteUserEvent(user: User): void {
    this.deleteUser.emit(user);
  }

  protected propertiesEvent(user: User): void {
    this.properties.emit(user);
  }

  protected userDetails(user: User): void {
    this.details.emit(user);
  }

  public updateTableAfterCreateUser(): void {
    this.toggleLoading();
    const page = 0;
    this.pageIndex = page;
    this.totalRows += 1;
    this.paginatorTotalRows = this.totalRows;
    this.nextPageIndexUpdateTable = this.eachPageUpdate;
    this.defaultSortRuleRequestInclude[0].value = true;
    this.defaultSortRuleExtraIndent = 0;

    this.subscriptions.push(
      this.usersEndpoints.getList(this.getInitGetUsersSettings).subscribe(
        (response) => {
          const data = response.data;
          this.tableData = this.pageCacheService.clearItemData().addItems(data.users).getItemsByPage(page).items;
          this.toggleLoading();
        },
        (_error) => {
          this.subscriptions.push(
            this.translate.get('USERS_PAGE.USERS_TABLE.ERRORS.LOAD_USERS').subscribe((message: string) => {
              this.snack.open(message, 'ok', { duration: 10000 });
            })
          );
          this.toggleLoading();
        }
      )
    );
  }

  public updateTableAfterEditUser(data: any): void {
    this.tableData = this.pageCacheService.update(data).getItemsByPage(this.pageIndex).items;
  }

  public updateTableAfterDeleteUser(userId: number | string): void {
    const page = 0;
    this.pageIndex = page;
    this.tableData = this.pageCacheService.delete(userId).getItemsByPage(page).items;
    this.paginatorTotalRows -= 1;
    this.totalRows -= 1;
  }

  public sortData(event: Sort): void {
    const active = event.active;
    let activeSortCacheField = active;
    const direction = event.direction;
    const page = 0;
    this.pageIndex = page;
    this.sort.field = active;
    this.sort.direction = direction;

    if (activeSortCacheField === 'status') {
      activeSortCacheField = 'enabled.status';
    }

    const pagesCount: number = this.pageCacheService
      .setSortType(direction)
      .setSortBy(activeSortCacheField)
      .getPagesCount(activeSortCacheField);

    if (page < pagesCount || this.isFullTable()) {
      this.tableData = this.pageCacheService.getItemsByPage(page).items;
      this.nextPageIndexUpdateTable = this.pageCacheService.getPagesCount(active);
    } else if (direction !== '' && !this.isFullTable()) {
      this.toggleLoading();

      const requestSortRuleParam = `${active}:${direction}`;

      this.subscriptions.push(
        this.usersEndpoints
          .getList({
            roles: this.role,
            page: (page + 1).toString(),
            sort: requestSortRuleParam,
            limit: this.pageSizeOptions[0].toString(),
            step: this.eachPageUpdate.toString()
          })
          .subscribe(
            (response) => {
              const data = response.data;
              this.tableData = this.pageCacheService.addItems(data.users).getItemsByPage(page).items;
              this.nextPageIndexUpdateTable = this.pageCacheService.getPagesCount(event.active);

              this.toggleLoading();
            },
            (_error) => {
              this.subscriptions.push(
                this.translate.get('USERS_PAGE.USERS_TABLE.ERRORS.LOAD_USERS').subscribe((message: string) => {
                  this.snack.open(message, 'ok', { duration: 10000 });
                })
              );
              this.toggleLoading();
            }
          )
      );
    } else {
      this.tableData = this.pageCacheService.getItemsByPage(page).items;
    }
  }

  protected toggleLoading(): void {
    this.isLoadingResults = !this.isLoadingResults;
    this.loading.emit({
      loading: this.isLoadingResults
    });
  }

  protected isFullTable(): boolean {
    return this.totalRows <= this.pageCacheService.count();
  }
}
