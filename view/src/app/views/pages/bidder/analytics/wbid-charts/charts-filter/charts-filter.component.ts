import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FilterRequestService } from '../../../../../../wmg_modules/statistics/main-filter/filter-request-services/filter-request.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrudService } from '../../../services/crud.service';
import { egretAnimations } from 'shared/animations/egret-animations';
import { SetPeriod } from '../helpers/set-period';
import { NgxPermissionsService } from 'ngx-permissions';
import { map, startWith } from 'rxjs/operators';
import { ChartQueryObject } from "shared/interfaces/reporting.interface";

@Component({
  selector: 'app-charts-filter',
  templateUrl: './charts-filter.component.html',
  styleUrls: ['./charts-filter.component.scss'],
  animations: egretAnimations
})
export class ChartsFilterComponent extends SetPeriod implements OnInit, OnDestroy {
  private reqBody;

  requestSubscription: Subscription[] = [];

  WbidChartsForm: FormGroup;

  public namesArray = [];

  public sitesArray = [];

  public selectedPublishers = [];

  private titlesForCharts = {
    bidder: [
      'TOP_BIDDERS_BY_CPM',
      'TOP_BIDDERS_BY_REVENUE',
      'TOP_BIDDERS_BY_IMPRESSIONS',
      'TOP_BIDDERS_BY_REQUESTS',
      'TOP_BIDDERS_BY_FILL_RATE'
    ],
    country: [
      'TOP_COUNTRIES_BY_CPM',
      'TOP_COUNTRIES_BY_REVENUE',
      'TOP_COUNTRIES_BY_IMPRESSIONS',
      'TOP_COUNTRIES_BY_REQUESTS',
      'TOP_COUNTRIES_BY_FILL_RATE'
    ]
  };

  public periodChart = {
    period: ['today', 'yesterday', 'last_three_days', 'last_seven_days', 'month_to_yesterday', 'last_month', 'last_sixty_days'],
    label: 'filter_period'
  };

  public labelMetrics = {
    metric: ['country', 'bidder'],
    label: 'label_metric'
  };

  public limitsForChart = { limit: ['5', '10'], label: 'filter_category' };

  private data_metric = ['revenue', 'impressions', 'cpm', 'fill_rate', 'requests'];

  public usersFullData = [];

  public usersDomains = [];

  public usersAdUnits = {
    postbid: [],
    prebid: []
  };

  private permissionCheck;

  filteredOptions: Observable<any>;

  filteredSites: Observable<any>;

  constructor(
    private filterRequestService: FilterRequestService,
    private fb: FormBuilder,
    private crud: CrudService,
    private NgxPermissionsS: NgxPermissionsService
  ) {
    super();
    this.WbidChartsForm = fb.group({
      period: ['last_seven_days'],
      limit: ['5'],
      label_metric: 'bidder',
      publisher_id: [{ value: [], disabled: true }],
      site: [{ value: [], disabled: true }],
      ad_unit: [{ value: [], disabled: true }]
    });
    this.permissionCheck = Object.keys(this.NgxPermissionsS.getPermissions());
  }

  ngOnInit() {
    this.autocompleteFunc();
    this.requestSubscription.push(
      this.crud.getPubsDomainsUnits().subscribe((data: any) => {
        if (data.success && data.results && data.results.length) {
          this.usersFullData = this.setCheckbox(data.results);
          if (this.permissionCheck.includes('prebidUserWbid') || this.permissionCheck.includes('postbidUserWbid')) {
            this.WbidChartsForm.get('site').enable();
            return;
          }
          this.WbidChartsForm.get('publisher_id').enable();
        }
      })
    );
    this.sendRequest();
  }

  referenceToDomains(pub) {
    pub.selected = !pub.selected;
    this.setNameHolder(pub.name);
    if (pub.selected) {
      this.selectedPublishers.push(pub.id);
      this.WbidChartsForm.get('publisher_id').setValue(this.selectedPublishers);
      this.selectedPublishers.length === 0 ? this.WbidChartsForm.get('site').disable() : this.WbidChartsForm.get('site').enable();
      // tslint:disable-next-line:no-unused-expression
      this.selectedPublishers.length === 0 ? this.WbidChartsForm.get('ad_unit').disable() : '';
      for (const i of pub.domains) {
        if (this.namesArray.includes(pub.name)) {
          this.usersDomains.push(i);
        }
      }
    } else {
      this.selectedPublishers.splice(this.selectedPublishers.indexOf(pub.id), 1);
      this.selectedPublishers.length === 0 ? this.WbidChartsForm.get('site').disable() : this.WbidChartsForm.get('site').enable();
      this.WbidChartsForm.get('publisher_id').setValue(this.selectedPublishers);
      // tslint:disable-next-line:no-unused-expression
      this.selectedPublishers.length === 0 ? this.WbidChartsForm.get('ad_unit').disable() : void 0;
      for (const i of pub.domains) {
        if (!this.namesArray.includes(pub.name)) {
          this.usersDomains.splice(this.usersDomains.indexOf(i), 1);
          if (this.sitesArray.includes(i.domain)) { this.sitesArray.splice(this.sitesArray.indexOf(i.domain), 1); }

          if (this.WbidChartsForm.get('site').value.includes(i.domain)) {
            this.WbidChartsForm.get('site').value.splice(this.WbidChartsForm.get('site').value.indexOf(i.domain), 1);
            for (const j of Object.keys(i.configs)) {
              if (this.sitesArray.includes(i.domain)) {
                i.configs[j].forEach((el) => {
                  this.usersAdUnits[j].push(el);
                });
              } else if (!this.sitesArray.includes(i.domain)) {
                i.configs[j].forEach((el) => {
                  this.usersAdUnits[j].splice(this.usersAdUnits[j].indexOf(el), 1);
                  if (this.WbidChartsForm.get('ad_unit').value.includes(el)) {
                    this.WbidChartsForm.get('ad_unit').value.splice(this.WbidChartsForm.get('ad_unit').value.indexOf(el), 1);
                  }
                });
              }
            }
          }
        }
      }
    }
  }

  referenceToAdUnits(domain) {
    domain.selected = !domain.selected;
    if (!this.sitesArray.includes(domain.domain)) {
      this.sitesArray.push(domain.domain);
    } else if (this.sitesArray.includes(domain.domain)) {
      this.sitesArray.splice(this.sitesArray.indexOf(domain.domain), 1);
    }

    (domain.configs.prebid.length === 0 && domain.configs.postbid.length === 0) || this.sitesArray.length === 0
      ? this.WbidChartsForm.get('ad_unit').disable()
      : this.WbidChartsForm.get('ad_unit').enable();
    for (const i of Object.keys(domain.configs)) {
      if (this.sitesArray.includes(domain.domain)) {
        domain.configs[i].forEach((el) => {
          this.usersAdUnits[i].push(el);
        });
      } else if (!this.sitesArray.includes(domain.domain)) {
        domain.configs[i].forEach((el) => {
          this.usersAdUnits[i].splice(this.usersAdUnits[i].indexOf(el), 1);
          if (this.WbidChartsForm.get('ad_unit').value.includes(el)) {
            this.WbidChartsForm.get('ad_unit').value.splice(this.WbidChartsForm.get('ad_unit').value.indexOf(el), 1);
          }
        });
      }
    }
  }

  setNameHolder(name) {
    if (this.namesArray.includes(name)) {
      this.namesArray.splice(this.namesArray.indexOf(name), 1);
    } else {
      this.namesArray.push(name);
    }
  }

  sendRequest(value: any = 'default') {
    if (value === 'default') {
      const { period_start, period_end } = this.setPeriods();
      this.reqBody = {
        period_start: period_start,
        period_end: period_end,
        limit: '5',
        label_metric: 'bidder',
        publisher_id: '',
        site: '',
        ad_unit: ''
      };
    } else {
      const { period_start, period_end } = this.setPeriods(value.period);
      this.reqBody = {
        period_start,
        period_end,
        limit: value.limit,
        label_metric: value.label_metric,
        publisher_id: !value.publisher_id || value.publisher_id.length === 0 ? '' : value.publisher_id,
        site: !value.site || value.site.length === 0 ? '' : value.site,
        ad_unit: !value.ad_unit ? '' : value.ad_unit
      };
    }

    for (const title of this.titlesForCharts[this.reqBody.label_metric]) {
      switch (true) {
        case Boolean(title.match(/cpm/gi)):
          this.reqBody.data_metric = 'cpm';
          break;
        case Boolean(title.match(/revenue/gi)):
          this.reqBody.data_metric = 'revenue';
          break;
        case Boolean(title.match(/impressions/gi)):
          this.reqBody.data_metric = 'impressions';
          break;
        case Boolean(title.match(/requests/gi)):
          this.reqBody.data_metric = 'requests';
          break;
        case Boolean(title.match(/fill_rate/gi)):
          this.reqBody.data_metric = 'fill_rate';
          break;
        default:
          break;
      }

      this.requestSubscription.push(
        this.filterRequestService.getChartsData(this.reqBody).subscribe((data: ChartQueryObject) => {
          data.result.pie.title = title;
          data.result.line.title = title;
          data.result.finishLength = this.titlesForCharts[this.reqBody.label_metric].length;
          this.filterRequestService.sendQuery(data);
        })
      );
    }
  }

  getKeysOfConfigs() {
    return this.usersAdUnits !== undefined ? Object.keys(this.usersAdUnits) : '';
  }

  resetPublishers() {
    this.WbidChartsForm.get('publisher_id').setValue([]);
    this.WbidChartsForm.get('ad_unit').setValue([]);
    this.WbidChartsForm.get('site').setValue([]);
    this.sitesArray = [];
    this.usersDomains = [];
    this.usersAdUnits = {
      postbid: [],
      prebid: []
    };
    this.namesArray = [];
    this.selectedPublishers = [];
    this.setCheckbox(this.usersFullData);
    this.WbidChartsForm.controls.site.disable();
    this.WbidChartsForm.controls.ad_unit.disable();
  }

  resetSites() {
    this.WbidChartsForm.get('site').setValue([]);
    this.WbidChartsForm.get('ad_unit').setValue([]);
    this.sitesArray = [];
    this.usersAdUnits = {
      postbid: [],
      prebid: []
    };
    this.WbidChartsForm.controls.ad_unit.disable();
  }

  resetPlacements() {
    this.WbidChartsForm.get('ad_unit').setValue([]);
  }

  setCheckbox(obj) {
    if (Array.isArray(obj)) {
      return obj.map((el) => {
        el.selected = false;
        el.domains.forEach((dom) => {
          dom.selected = false;
        });
        return el;
      });
    }

    return [];
  }

  autocompleteFunc() {
    const _filterPublisher = (value) => {
      const filterValue = value.toLowerCase();
      return this.usersFullData.filter((option) => option.name.toLowerCase().includes(filterValue));
    };
    this.filteredOptions = this.WbidChartsForm.controls.publisher_id.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : '')),
      map((value) => _filterPublisher(value))
    );
  }

  optionClicked(event, user) {
    event.stopPropagation();
    this.referenceToDomains(user);
  }

  getShortenedPublishersList(): string | boolean {
    if (this.namesArray.length > 0) {
      if (this.namesArray.length === 1) {
        return this.namesArray[0];
      } else {
        return `${ this.namesArray[0] } (+${ this.namesArray.length - 1 } ${ this.namesArray.length - 1 === 1 ? 'other' : 'others' })`;
      }
    } else { return false; }
  }

  clearPlaceholder(value: string | Array<string>) {
    if (value.length === 0) { this.WbidChartsForm.get('publisher_id').setValue(''); }

  }

  ngOnDestroy(): void {
    if (this.requestSubscription.length > 0) { this.requestSubscription.forEach((subscription) => subscription.unsubscribe()); }
  }
}
