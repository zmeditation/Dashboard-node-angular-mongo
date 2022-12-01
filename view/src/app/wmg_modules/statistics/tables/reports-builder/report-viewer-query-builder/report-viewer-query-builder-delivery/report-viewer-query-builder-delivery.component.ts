import { ROLES } from 'shared/interfaces/roles.interface';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReportViewerQueryBuilderService } from '../../../helpers/report-viewer-query-builder.service';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { Subscription } from 'rxjs/Rx';
import { EventCollectorService } from "shared/services/event-collector/event-collector.service";
import { UserInfo } from "shared/interfaces/common.interface";

@Component({
  selector: 'app-report-viewer-query-builder-delivery',
  templateUrl: './report-viewer-query-builder-delivery.component.html',
  styleUrls: ['./report-viewer-query-builder-delivery.component.scss']
})
export class ReportViewerQueryBuilderDeliveryComponent implements OnInit, OnDestroy {
  @Input() tabGroup;

  @Input() isChartOption;

  @Input() starterObject;

  @Input() queryObject;

  @Input() isOptionForCommission;

  @Input() typeReport;

  subscriptions: Subscription[] = [];

  runReportBtn = false;

  chartChecked = false;

  user: UserInfo;

  constructor(
    private queryBuilderService: ReportViewerQueryBuilderService,
    private flashMessages: FlashMessagesService,
    public event: EventCollectorService
  ) {
  }

  ngOnInit() {
    this.event.managedUserInfo$.subscribe(user => {
      this.user = user;
    });
    this.queryBuilderService.setQueryObjectToDelivery(this.queryObject);
    this.queryBuilderService.setStarterObject(this.starterObject);
    this.subscriptions.push(this.queryBuilderService.deliveryListener$.subscribe((query) => this.deliveryHandler(query)));
  }

  ngOnDestroy() {
    const starter = this.queryBuilderService.getStarterObject();
    this.queryBuilderService._deliveryHandler.next(starter);
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  deliveryHandler(query): void {
    this.queryBuilderService.resetResults(this.chartChecked);
    if (this.tabGroup) {
      this.tabGroup._tabs._results.forEach((obj, i) => {
        i > 0 ? (obj._disabled = true) : false;
      });
    }
    this.runReportBtn = false;
    this.queryObject = query;
  }

  setPartnersFilterData(): void {
    const setFilters: Array<any> = this.queryObject.request.filters;
    if (this.user?.role === ROLES.PARTNER) {
      const currentRTBType = this.user.oRTBType;
      const addFilters = {
        'SSP': () => this.addSSPFilter(setFilters, this.user),
        'DSP': () => this.addDSPFilter(setFilters, this.user),
        'default': () => {
          return;
        }
      }

      addFilters[currentRTBType]() || addFilters.default();
    }
  }

  addSSPFilter(setFilters: Array<any>, user: UserInfo | any): void {
    let filterCounter = 0;
    for (const filter of setFilters) {
      if (filter.name === 'PUBLISHERS') {
        filterCounter++;
      }
    }
    if (filterCounter === 0) { // do not add partner's filter more that one time
      this.queryObject.request.filters.push({
        filterId: '63508',
        name: 'PUBLISHERS',
        type: 'include',
        values: [user.oRTBId.toString()]
      })
    }
  }

  addDSPFilter(setFilters: Array<any>, user: UserInfo): void {
    let filterCounter = 0;
    for (const filter of setFilters) {
      if (filter.name === 'DSP') {
        filterCounter++;
      }
    }
    if (filterCounter === 0) {
      this.queryObject.request.filters.push({
        filterId: "89564",
        name: "DSP",
        type: "include",
        values: [user.name]
      })
    }
  }

  setWMGAdapterFilter(): void {
    const filters: Array<any> = this.queryObject.request.filters;
    if (this.user?.adWMGAdapter === true) {
      this.addSSPFilter(filters, { oRTBId: 60 });
      this.setSSPIdFilter();
    }
  }

  setSSPIdFilter(): void {
    const isSSPPubIDFilterSet: boolean = this.queryObject.request.filters.filter(filter => filter.name === 'ssp_pub_id').length === 0;
    if (isSSPPubIDFilterSet) {
      this.queryObject.request.filters.push({
        filterId: "77878",
        name: "ssp_pub_id",
        type: "include",
        values: [this.user._id.toString()]
      })
    }
  }

  runReport(): void {

    if (!this.checkRangeAndInterval(this.queryObject)) {
      return;
    }

    this.setPartnersFilterData();
    this.setWMGAdapterFilter();

    /*    // if SSP dimension selected, show only wmg adapter SSPs
    if (
      this.queryObject.request.type === 'ortb' &&
      this.queryObject.request.dimensions.includes('ssp_pub_id') &&
      this.queryObject.request.filters.length === 0
    ) {
      console.log('checked')
      this.queryObject.request.filters.push({
        filterId: '63508',
        name: 'PUBLISHERS',
        type: 'include',
        values: ['60']
      });
    }*/

    if (this.chartChecked) {
      const chartQuery = this.getChartQuery(this.queryObject);
      this.subscriptions.push(
        this.queryBuilderService.postQueryToServer(chartQuery, this.typeReport).subscribe((object) => {
          if (object.success === true) {
            this.queryBuilderService.sendChartQueryResults(object);
          }
        })
      );
    }

    this.tabGroup.selectedIndex = 1;
    this.tabGroup._tabs._results.forEach((obj, i) => {
      i > 0 ? (obj._disabled = false) : true;
    });

    this.subscriptions.push(
      this.queryBuilderService.postQueryToServer(this.queryObject, this.typeReport).subscribe((object) => {
        if (object !== null && object.success === true) {
          this.queryBuilderService.sendQueryResults(object);
          this.runReportBtn = true;
        }
      })
    );
  }

  private getChartQuery(query): any {
    const chartQuery = JSON.parse(JSON.stringify(query));
    const metrics = ['impressions', 'clicks', 'ctr', 'revenue', 'cpm', 'requests', 'fillRate'];
    const {
      request: { interval }
    } = chartQuery;
    chartQuery.request.interval = interval === 'total' ? 'daily' : interval;
    chartQuery.request.dimensions = interval === 'total' ? ['daily'] : [interval];
    chartQuery.request.metrics = metrics;
    chartQuery.request.enableExport = false;
    return chartQuery;
  }

  private checkRangeAndInterval(object): boolean {
    const {
      request: {
        range,
        customRange: { dateFrom, dateTo }
      }
    } = object;

    if (range === 'custom') {
      if (this.checkIfCorrectDates(dateFrom, dateTo)) {
        this.flashMessages.flash('error', 'MISSING_CUSTOM_DATES', 3000);
        return false;
      } else if (dateTo < dateFrom) {
        this.flashMessages.flash('error', 'DATE_FROM_IS_YOUNGER_THAN_DATE_TO', 3000);
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }

  }

  private checkIfCorrectDates(from, to): boolean {
    return (from && !to) || (!from && to) || (!from && !to);
  }

  public chartChanged(event) {
    this.chartChecked = event.checked;
    this.queryBuilderService.resetResults(this.chartChecked);
    this.runReportBtn = false;
  }

  selectionForGoogleCommission(event) {
    this.queryBuilderService.sendCommissionOption(event.checked);
    this.runReportBtn = this.runReportBtn ? false : false;

    if (event.checked) {
      this.queryBuilderService.sendMetricsForm(
        ['impressions', 'clicks', 'ctr', 'revenue', 'cpm', 'requests', 'fillRate', 'viewability', 'partnersFee']
      );
      this.queryBuilderService.sendDimensionsForm(['domain']);
      this.queryBuilderService.setQueryObjectToDelivery(this.queryObject);
    } else if (!event.checked) {
      this.queryBuilderService.sendMetricsForm(
        ['impressions', 'clicks', 'ctr', 'revenue', 'cpm', 'requests', 'fillRate', 'viewability']
      );
      this.queryBuilderService.sendDimensionsForm([]);
      this.queryBuilderService.sendFiltersForm([]);
    }
  }
}
