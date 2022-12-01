import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { EventCollectorService } from 'shared/services/event-collector/event-collector.service';
import { egretAnimations } from 'shared/animations/egret-animations';
import { UserInfo } from 'shared/interfaces/common.interface';
import { FilterRequestService } from '../../main-filter/filter-request-services/filter-request.service';
import { MainChartVariables } from './helpers/main-chart-variables';
import { UpdateChartsValueService } from '../../main-filter/filter-request-services/update-charts-value.service';
import { QueryObject, ReportsData } from 'shared/interfaces/reporting.interface';

@Component({
  selector: 'app-main-chart',
  templateUrl: './main-chart.component.html',
  styleUrls: ['./main-chart.component.scss'],
  animations: egretAnimations
})
export class MainChartComponent extends MainChartVariables implements OnInit, OnDestroy {
  setChartContainerHeight = '250px';

  queryOption: string;

  public lineChartLabels: string[] = ['Empty'];

  public readyToShow = false;

  public hideReqAndFillPermission: boolean;

  public currentReportType = 'main';

  protected chartsSubscriptions: Subscription[] = [];

  @Input() userid: UserInfo;

  @Input() reportType: Observable<string>;

  constructor(
    public event: EventCollectorService,
    public NgxPermissionsS: NgxPermissionsService,
    private filterRequestService: FilterRequestService,
    public translate: TranslateService,
    public UpdateValueService: UpdateChartsValueService
  ) {
    super();
  }

  ngOnInit(): void {
    this.chartsSubscriptions.push(
      this.reportType.subscribe((type) => {
        this.currentReportType = type;
      })
    );

    this.chartsSubscriptions.push(
      this.filterRequestService.query$.subscribe((query: QueryObject) => {
        this.readyToShow = true;
        this.updateChartData(query.chartData, query.chartData.length);
      })
    );

    this.chartsSubscriptions.push(
      this.UpdateValueService.status().subscribe((data) => {
        this.readyToShow = data === 'loaded';
      })
    );

    this.hideReqAndFillPermission = !!this.NgxPermissionsS.getPermissions().hideRequestsAndFillrate;
  }

  updateChartData(object: Array<ReportsData>, length: number): void {
    const chartObject = object.map((el) => Object.assign({}, el)).sort((a, b) => {
      if (a.date > b.date) {
        return 1;
      }
      if (a.date < b.date) {
        return -1;
      }
      return 0;
    });

    length < 2 ? (this.lineChartType = 'bar') : (this.lineChartType = 'line');
    this.lineChartLabels = [];
    const labelsArr: string[] = [];
    const prop1Arr: number[] = [];
    const prop2Arr: number[] = [];
    const prop3Arr: number[] = [];
    const prop4Arr: number[] = [];
    const requests: number[] = [];
    const propName: string[] = ['REVENUE', 'IMPRESSIONS', 'AVERAGE_CPM', 'FILL_RATE'],
      propData = [[prop1Arr, prop2Arr, prop3Arr, prop4Arr]];

    if (this.hideReqAndFillPermission === true) {
      propName.pop();
      propData[0].pop();
    }

    chartObject.forEach((day: ReportsData) => {
      if (this.currentReportType !== 'oRTB') {
        labelsArr.push(day.date);
        prop1Arr.push(day.metrics.revenue);
        prop2Arr.push(day.metrics.impressions);
        prop3Arr.push(day.metrics.cpm);
        prop4Arr.push(day.metrics.fillrate);
        requests.push(day.metrics.requests);
      } else {
        day.date ? labelsArr.push(day.date) : labelsArr.push('total');
        prop1Arr.push(day.metrics.revenue_imp);
        prop2Arr.push(day.metrics.impression);
        prop3Arr.push(day.metrics.cpm_imp);
        prop4Arr.push(day.metrics.ssp_imp_fill_rate);
        requests.push(day.metrics.ssp_requests);
      }
    });

    this.countConsolidatedSum(chartObject, requests, prop1Arr, prop2Arr, prop4Arr);

    if (labelsArr && labelsArr.length) {
      this.lineChartLabels = [];
      for (const label of labelsArr) {
        label !== undefined ? this.lineChartLabels.push(label.split('-').splice(1, 2).join('.')) : false;
      }
    }
    this.lineChartSteppedData = [];
    this.chartMethods.updateLineChartData(this.lineChartSteppedData, propData, propName, this.consolidatedSum);
    this.readyToShow = true;
  }

  countConsolidatedSum(object: Array<ReportsData>, requests, prop1Arr, prop2Arr, prop4Arr): void {
    if (object[0].interval === 'daily') {
      const sumOfRequests = requests.reduce(function (s, c) {
        return s + c;
      }, 0);
      const sumOfImpressions = prop2Arr.reduce(function (s, c) {
        return s + c;
      }, 0);
      const sumOfRevenue = prop1Arr.reduce(function (s, c) {
        return s + c;
      }, 0);

      const averageRtbFillRate =
        prop4Arr.reduce((a, b) => {
          return a + b;
        }, 0) / object.length;

      this.consolidatedSum = [];

      // revenue
      this.consolidatedSum.push(
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
          currency: 'USD',
          currencyDisplay: 'code'
        }).format(sumOfRevenue)
      );

      // impressions
      this.consolidatedSum.push(
        new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0
        }).format(sumOfImpressions)
      );

      // CPM
      this.consolidatedSum.push(
        `USD ${new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        }).format((sumOfRevenue / sumOfImpressions) * 1000)}`
      );

      // Fill Rate
      this.currentReportType !== 'oRTB'
        ? this.consolidatedSum.push(
            `${new Intl.NumberFormat('en-US', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            }).format((sumOfImpressions / sumOfRequests) * 100)} %`
          )
        : this.consolidatedSum.push(
            `${new Intl.NumberFormat('en-US', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            }).format(averageRtbFillRate)} %`
          );

      if (isNaN(sumOfRevenue / sumOfImpressions)) {
        this.consolidatedSum[2] = 'USD 0.00';
      }

      if (isNaN(sumOfImpressions / sumOfRequests)) {
        this.consolidatedSum[3] = '0.00 %';
      }

      if (isNaN(sumOfRevenue)) {
        this.consolidatedSum[0] = 'USD 0.00';
      }
    } else if (object[0].interval === 'total') {
      this.consolidatedSum = [];

      this.currentReportType !== 'oRTB'
        ? this.consolidatedSum.push(
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
              currency: 'USD',
              currencyDisplay: 'code'
            }).format(object[0].metrics.revenue),
            new Intl.NumberFormat('en-US', {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0
            }).format(object[0].metrics.impressions),
            `USD ${object[0].metrics.cpm}`,
            `${object[0].metrics.fillrate} %`
          )
        : this.consolidatedSum.push(
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
              currency: 'USD',
              currencyDisplay: 'code'
            }).format(object[0].metrics.revenue_imp),
            new Intl.NumberFormat('en-US', {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0
            }).format(object[0].metrics.impression),
            `USD ${object[0].metrics.cpm_imp}`,
            `${object[0].metrics.ssp_imp_fill_rate} %`
          );

      if (isNaN(object[0].metrics.revenue_imp)) {
        this.consolidatedSum[0] = 'USD 0.00';
      }

      if (object[0].metrics.revenue) {
        this.consolidatedSum[0] = `USD ${object[0].metrics.revenue}`;
      }

      if (isNaN(object[0].metrics.cpm_imp)) {
        this.consolidatedSum[2] = 'USD 0.00';
      }

      if (object[0].metrics.cpm) {
        this.consolidatedSum[2] = `USD ${object[0].metrics.cpm}`;
      }
    }
  }

  isNaN(x: any) {
    return isNaN(x);
  }

  ngOnDestroy(): void {
    this.chartsSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
