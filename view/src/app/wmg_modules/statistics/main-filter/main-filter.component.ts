import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { NgxPermissionsService } from 'ngx-permissions';
import { map, startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { EventCollectorService } from 'shared/services/event-collector/event-collector.service';
import { egretAnimations } from 'shared/animations/egret-animations';
import { FilterRequestService } from './filter-request-services/filter-request.service';
import { ConfigInputDomains } from './helpers/config-input-domains';
import { User, UserInfo } from 'shared/interfaces/common.interface';
import { UpdateChartsValueService } from './filter-request-services/update-charts-value.service';
import { PaginationSettings } from './types';
import { AuthGuard } from 'shared/services/auth/auth.guard.service';
import { Filter } from 'shared/interfaces/reporting.interface';
import { ROLES } from 'shared/interfaces/roles.interface';

@Component({
  selector: 'app-main-filter',
  templateUrl: './main-filter.component.html',
  styleUrls: ['./main-filter.component.scss'],
  animations: egretAnimations
})
export class MainFilterComponent extends ConfigInputDomains implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  @Output()
  public reportType = new EventEmitter();

  protected publishers: Array<any> = [];

  protected publishersPage = 1;

  protected isSearchPublishers = false;

  public filteredRtbUsers: any[];

  public filteredDomainsStates: any[];

  daysByDefault: any;

  user: UserInfo;

  optionsByDefault: any;

  queryByDefault: any;

  _currentReportType = 'main';

  mainReportMetrics: string[] = ['revenue', 'cpm', 'impressions', 'fillRate', 'requests', 'clicks', 'ctr', 'viewability'];

  constructor(
    public event: EventCollectorService,
    public snackBar: MatSnackBar,
    public filterRequestService: FilterRequestService,
    public NgxPermissionsS: NgxPermissionsService,
    public authGuard: AuthGuard,
    public UpdateChartsValue: UpdateChartsValueService
  ) {
    super(filterRequestService, snackBar, NgxPermissionsS, UpdateChartsValue);
  }

  set currentReportType(val: string) {
    this._currentReportType = val;
    this.reportType.emit(val);
  }

  get currentReportType(): string {
    return this._currentReportType;
  }

  get oRTBReportMetrics(): string[] {
    if (this.user?.role === ROLES.PARTNER && this.user?.oRTBType === 'SSP') {
      return ['ssp_requests', 'ssp_responses', 'impression', 'revenue_imp', 'cpm_imp', 'ssp_imp_fill_rate'];
    }

    if (this.user?.role === ROLES.PARTNER && this.user?.oRTBType === 'DSP') {
      return ['dsp_requests', 'dsp_response', 'impression', 'revenue_imp', 'cpm_imp', 'dsp_imp_fill_rate'];
    }

    if (this.user?.adWMGAdapter === true) {
      return ['ssp_requests', 'ssp_responses', 'impression', 'revenue_imp', 'cpm_imp', 'ssp_imp_fill_rate'];
    }

    return ['dsp_requests', 'ssp_requests', 'dsp_response', 'ssp_responses', 'impression', 'revenue_imp', 'cpm_imp', 'ssp_imp_fill_rate'];
  }

  ngOnInit() {
    this.getUserInfo();

    this.daysByDefault = this.days[2];
    this.optionsByDefault = this.options[0];
    this.queryByDefault = this.queryType[0];
    this.permissionsByReports();
    this.checkIfPartner();
    this.reportType.emit(this.currentReportType);

    if (this.byReportsPerm) {
      this.getPubs();
    } else if (!this.isPartner) {
      this.subscriptions.add(
        this.filterRequestService.getFilterResultsById('97677').subscribe((data: { name: string; results: string[] }) => {
          this.usersFromDB = data.results;
          for (const u of data.results) {
            this.domainsFromDB.push({
              domain: u,
              selected: false
            });
          }

          this.publishers = [...this.getDataByPage({ items: this.usersFromDB, page: this.publishersPage })];
        })
      );
    }

    // FORM
    this.inputFilterForm = new FormGroup({
      usersForm: new FormControl('All publishers'),
      domainsForm: new FormControl({ value: 'All domains', disabled: true }),
      daysForm: new FormControl(this.daysByDefault.value),
      queryForm: new FormControl(this.queryByDefault.optionName),
      oRTBUsersForm: new FormControl('All publishers')
    });
    if (this.byReportsPerm === false) {
      this.inputFilterForm.controls.domainsForm.enable();
    }

    // FORM END

    const usersValueChange = this.inputFilterForm.controls.oRTBUsersForm.valueChanges
      .pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : this.lastFilter)),
        map((filter) => this.filter(filter))
      )
      .subscribe((data) => (this.filteredRtbUsers = data));
    this.subscriptions.add(usersValueChange);

    const domainsValueChange = this.inputFilterForm.controls.domainsForm.valueChanges
      .pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : this.lastFilterDomain)),
        map((filter) => this.filterForDomains(filter))
      )
      .subscribe((data) => (this.filteredDomainsStates = data));
    this.subscriptions.add(domainsValueChange);
  }

  getUserInfo(): void {
    const getUserInfoSub = this.authGuard
      .verifyToken()
      .subscribe((data: { success: boolean; message: string; expired: boolean; user: UserInfo }) => {
        const { user } = data;
        this.user = user;
        // starting request after we know who the current user is
        // if PARTNER or publisher with adWMG adapter, set reports to oRTB mode
        if (user.role === ROLES.PARTNER || user.adWMGAdapter === true) {
          this.currentReportType = 'oRTB';
          this.reportTypeSelector({ value: 'oRTB', source: undefined });
        } else {
          this.getQuery(this.currentReportType, this.getRequestQuery());
        }
      });
    this.subscriptions.add(getUserInfoSub);
  }

  getPubs(): void {
    const getPublishersSub = this.filterRequestService.getFilterResultsById('63508').subscribe((data: { name: string; results: User[] }) => {
      this.usersFromDB = data.results.filter((user) => user.enabled === true);
      for (const user of data.results) {
        for (const domain of user.domains) {
          this.domainsFromDB.push({
            domain: domain,
            selected: false
          });
        }
      }

      this.publishers = [...this.getDataByPage({ items: this.usersFromDB, page: this.publishersPage })];
    });

    this.subscriptions.add(getPublishersSub);
  }

  protected getDataByPage(data: PaginationSettings): Array<any> {
    const result: Array<any> = [];
    const items: Array<any> = data.items;
    const limit: number = data.limit ? data.limit : 20;
    const startIndex: number = (data.page - 1) * limit;
    let endIndex: number = startIndex + limit;
    endIndex = items.length < endIndex ? items.length : endIndex;

    for (let i = startIndex; i < endIndex; i++) {
      result.push(items[i]);
    }

    return result;
  }

  protected loadPublishers(event: any) {
    event.stopPropagation();
    this.publishersPage++;
    const newData = this.getDataByPage({ items: this.usersFromDB, page: this.publishersPage });
    this.publishers = [...this.publishers, ...newData];
  }

  protected searchPublishers(value: string) {
    if (value) {
      this.isSearchPublishers = true;
      this.publishers = this.filter(value);
    } else {
      this.isSearchPublishers = false;
      this.publishersPage = 1;
      this.publishers = [...this.getDataByPage({ items: this.usersFromDB, page: this.publishersPage })];
    }
  }

  public clearInputChecks(checked: any): void {
    super.clearInputChecks(checked);
    this.publishersPage = 1;
    this.publishers = [...this.getDataByPage({ items: this.usersFromDB, page: this.publishersPage })];
  }

  public clearFormInputUsers(): void {
    super.clearFormInputUsers();
    this.publishersPage = 1;
    this.publishers = [...this.getDataByPage({ items: this.usersFromDB, page: this.publishersPage })];
  }

  get formSortData() {
    return this.inputFilterForm.controls.queryForm as FormControl;
  }

  get formPeriodData() {
    return this.inputFilterForm.controls.daysForm as FormControl;
  }

  reportTypeSelector(e: MatButtonToggleChange): void {
    this.currentReportType = e.value;
    this.usersFromDB = [];
    this.getQuery(e.value, this.getRequestQuery());
    if (e.value === 'oRTB') {
      this.inputFilterForm.controls.domainsForm.disable();
      // this.getRTBUsers();
    } else {
      this.domainsFromDB = [];
      if (this.byReportsPerm === true) {
        this.getMainDomainsAndUsers();
      }
    }
  }

  getRTBUsers(reportType = 'oRTB'): void {
    const getPartnersSub = this.filterRequestService
      .getFilterResultsById('11281', reportType)
      .subscribe((publishers: { success: boolean; name: string; results: User[] }) => {
        this.usersFromDB = publishers.results;
      });
    this.subscriptions.add(getPartnersSub);
  }

  getMainDomainsAndUsers(): void {
    const getUsersAndDomainsSub = this.filterRequestService
      .getFilterResultsById('63508')
      .subscribe((publishers: { success: boolean; name: string; results: User[] }) => {
        this.usersFromDB = publishers.results;
        for (const user of publishers.results) {
          for (const domain of user.domains) {
            this.domainsFromDB.push({
              domain: domain,
              selected: false
            });
          }
        }
      });
    this.subscriptions.add(getUsersAndDomainsSub);
  }

  getRTBDomains(): void {
    const getDomainsSub = this.filterRequestService.getFilterResultsById('97677').subscribe((data: { name: string; results: string[] }) => {
      this.usersFromDB = data.results;
      for (const user of data.results) {
        this.domainsFromDB.push({
          domain: user,
          selected: false
        });
      }
    });
    this.subscriptions.add(getDomainsSub);
  }

  getFilterForPartners(): Filter[] {
    if (this.user?.role !== ROLES.PARTNER && this.user?.adWMGAdapter !== true) {
      return [];
    }

    if (this.user?.adWMGAdapter === true) {
      return [
        {
          filterId: '63508',
          name: 'PUBLISHERS',
          type: 'include',
          values: ["60"]
        },
        {
          filterId: "77878",
          name: "ssp_pub_id",
          type: "include",
          values: [this.user._id.toString()]
        }
      ];
    }

    if (this.user?.role === ROLES.PARTNER && this.user?.oRTBType === 'SSP') {
      return [
        {
          filterId: '63508',
          name: 'PUBLISHERS',
          type: 'include',
          values: [this.user.oRTBId.toString()]
        }
      ];
    }

    if (this.user?.role === ROLES.PARTNER && this.user?.oRTBType === 'DSP') {
      return [
        {
          filterId: '89564',
          name: 'DSP',
          type: 'include',
          values: [this.user.name]
        }
      ];
    }
  }

  getRequestQuery() {
    return {
      request: {
        type: this.currentReportType === 'oRTB' ? 'oRTB' : 'analytics',
        range: this.inputFilterForm.get('daysForm').value,
        interval: this.inputFilterForm.get('queryForm').value.toLowerCase(),
        fillMissing: true,
        customRange: {
          dateFrom: '',
          dateTo: ''
        },
        metrics: this.currentReportType === 'oRTB' ? this.oRTBReportMetrics : this.mainReportMetrics,
        filters: this.getFilterForPartners(),
        dimensions:
          this.currentReportType === 'oRTB'
            ? this.inputFilterForm.get('queryForm').value.toLowerCase() === 'total'
              ? []
              : ['day']
            : ['daily']
      }
    };
  }

  getQuery(typeOfReport: string, params: any = this.getRequestQuery()): void {
    if (typeOfReport === 'main') {
      const { metrics } = params.request;
      if (metrics.includes('fillrate')) {
        metrics[metrics.indexOf('fillrate')] = 'fillRate';
      }
      params.request.metrics = metrics;
    }
    this.getData(params, typeOfReport);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
