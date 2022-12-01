import { Component, OnInit, OnDestroy } from '@angular/core';
import { WbidChartsVariables } from './helpers/wbid-charts-variables';
import { NgxPermissionsService } from 'ngx-permissions';
import { egretAnimations } from 'shared/animations/egret-animations';
import { FilterRequestService } from '../../main-filter/filter-request-services/filter-request.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wbid-analytics-charts',
  templateUrl: './wbid-analytics-charts.component.html',
  styleUrls: ['./wbid-analytics-charts.component.scss'],
  animations: egretAnimations
})
export class WbidAnalyticsChartsComponent extends WbidChartsVariables implements OnInit, OnDestroy {
  public allCharts: Array<any> = [];

  public summOfMetrics = [];

  public typesChart = ['bar', 'pie', 'horizontalBar', 'line'];

  public selectedChartTypeLegend = {};

  private dataForCorrectCpm: any = {};

  subscriptionOnData: Subscription;

  public isData = true;

  public fullLengthOfData;

  protected elementsSortLocationIndexes = {
    by_requests: {
      total: 0,
      chart: 1
    },
    by_impressions: {
      total: 1,
      chart: 2
    },
    by_cpm: {
      total: 2,
      chart: 3
    },
    by_revenue: {
      total: 3,
      chart: 0
    },
    by_fill_rate: {
      chart: 4
    }
  };

  protected isSortedCharts = false;

  protected horizontalBarOptions = {
    animation: { animateScale: true },
    tooltips: {
      intersect: true,
      mode: 'index'
    },
    maintainAspectRatio: true,
    responsive: true,
    layout: {
      padding: {
        bottom: 20,
        left: 20,
        right: 10,
        top: 20
      }
    },
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          display: true,
          gridLines: {
            color: 'rgba(0,0,0,0.04)',
            display: true,
            zeroLineColor: 'rgba(0,0,0,0.08)'
          },
          stacked: false
        }
      ]
    }
  };

  constructor(public NgxPermissionsS: NgxPermissionsService, private filterRequestService: FilterRequestService) {
    super(NgxPermissionsS);
  }

  ngOnInit() {
    this.subscriptionOnData = this.filterRequestService.query$.subscribe((query) => {
      const pieData = query.result.pie;
      const lineData = query.result.line;
      this.fullLengthOfData = query.result.finishLength;
      if (this.allCharts.length >= query.result.finishLength) {
        this.allCharts = [];
        this.summOfMetrics = [];
      }
      this.settingsLegendAndTypeOfChart(pieData);
      const fullConfigForChart = this.setChartOptions(this.defaultChartOptions, pieData, lineData);
      this.allCharts.push(fullConfigForChart);
      this.allCharts = this.sortByTitles(this.allCharts, true);
      this.aggregateToTotal(query);
      this.summOfMetrics = this.sortByTitles(this.summOfMetrics);
    });
  }

  ngDoCheck() {
    this.checkChartLegendOnPie();
  }

  protected async checkChartLegendOnPie(): Promise<void> {
    if (this.isSortedCharts) {
      for (const chartTitle in this.selectedChartTypeLegend) {
        if (this.selectedChartTypeLegend[chartTitle].type !== 'pie' && this.selectedChartTypeLegend[chartTitle].legend) {
          this.selectedChartTypeLegend[chartTitle].legend = false;
          const currentType = this.selectedChartTypeLegend[chartTitle].type;
          this.selectedChartTypeLegend[chartTitle].type = 'pie';
          setTimeout(() => {
            this.selectedChartTypeLegend[chartTitle].type = currentType;
          }, 0);
        }
      }
    }
  }

  setChartOptions(stdOpt: any, destObj: any, destObjLine: any) {
    destObj.isData = destObj.datasets[0].data.length !== 0;
    destObjLine.isData = destObjLine.datasets.length !== 0 ? destObjLine.datasets[0].data.length !== 0 : false;
    stdOpt.chart_title = destObj.title.toLowerCase();
    stdOpt.chartType = this.selectedChartTypeLegend[destObj.title].type;
    destObj.chartOptions = {};
    destObjLine.chartOptions = {};
    Object.assign(destObj.chartOptions, stdOpt);
    Object.assign(destObjLine.chartOptions, stdOpt);
    return {
      pie: destObj,
      line: destObjLine
    };
  }

  sortByTitles(arr: any[], isChart = false): any[] {
    if ((isChart && arr.length !== 5) || (!isChart && arr.length !== 4)) {
      return arr;
    }

    const result = Array(arr.length).fill({ pie: { title: '' } });
    const componentType = isChart ? 'chart' : 'total';
    const requestsSubstring = 'by_requests';
    const impressionsSubstring = 'by_impressions';
    const cpmSubstring = 'by_cpm';
    const revenueSubstring = 'by_revenue';
    const fillRateSubstring = 'by_fill_rate';

    for (const element of arr) {
      const title =
        Object.keys(element).includes('pie') && element.pie.title ? element.pie.title.toLowerCase() : element.title.toLowerCase();
      let index: number;

      if (title.includes(requestsSubstring)) {
        index = this.elementsSortLocationIndexes[requestsSubstring][componentType];
        result[index] = element;
        continue;
      }

      if (title.includes(impressionsSubstring)) {
        index = this.elementsSortLocationIndexes[impressionsSubstring][componentType];
        result[index] = element;
        continue;
      }

      if (title.includes(cpmSubstring)) {
        index = this.elementsSortLocationIndexes[cpmSubstring][componentType];
        result[index] = element;
        continue;
      }

      if (title.includes(revenueSubstring)) {
        index = this.elementsSortLocationIndexes[revenueSubstring][componentType];
        result[index] = element;
        continue;
      }

      if (title.includes(fillRateSubstring)) {
        index = this.elementsSortLocationIndexes[fillRateSubstring][componentType];
        result[index] = element;
      }
    }

    if (arr.length === 5) {
      this.isSortedCharts = true;
    }

    return result;
  }

  settingsLegendAndTypeOfChart(chart) {
    this.selectedChartTypeLegend[chart.title] = {
      type: 'bar',
      legend: false
    };
  }

  aggregateToTotal(data) {
    switch (true) {
      case Boolean(data.result.pie.title.match(/revenue/gi)):
        const summRev =
          data.result.pie.datasets[0].data.length === 0
            ? 0
            : data.result.pie.datasets[0].data.reduce((agr, next) => {
              let res = agr + next;
              const splitValue = res.toString().split(/\./);
              if (splitValue.length > 1 && splitValue[1].length > 2) {
                res = Math.round(res * 100) / 100;
              }
              return res;
            });

        this.dataForCorrectCpm.revenue = Math.round(summRev * 100) / 100;
        this.summOfMetrics.push({
          title: data.result.pie.title,
          result: this.newIntlNumber(Math.round(summRev * 100) / 100, 2, 2)
        });
        break;
      case Boolean(data.result.pie.title.match(/impressions/gi)):
        const summImp =
          data.result.pie.datasets[0].data.length === 0
            ? 0
            : data.result.pie.datasets[0].data.reduce((agr, next) => {
              return agr + next;
            });
        this.dataForCorrectCpm.impressions = summImp;
        this.summOfMetrics.push({
          title: data.result.pie.title,
          result: this.newIntlNumber(summImp)
        });
        break;
      case Boolean(data.result.pie.title.match(/cpm/gi)):
        this.summOfMetrics.push({
          title: data.result.pie.title
        });
        break;
      case Boolean(data.result.pie.title.match(/requests/gi)):
        const summReq =
          data.result.pie.datasets[0].data.length === 0
            ? 0
            : data.result.pie.datasets[0].data.reduce((agr, next) => {
              return agr + next;
            });
        this.summOfMetrics.push({
          title: data.result.pie.title,
          result: this.newIntlNumber(summReq)
        });
        break;
      default:
        break;
    }
    this.summOfMetrics = this.sortByTitles(this.summOfMetrics);
    if (Object.keys(this.dataForCorrectCpm).includes('impressions') && Object.keys(this.dataForCorrectCpm).includes('revenue')) {
      this.setCorrectCpm();
    }
  }

  newIntlNumber(num, maximumFractionDigits = 0, minimumFractionDigits = 0) {
    const result = new Intl.NumberFormat('en-US', {
      maximumFractionDigits,
      minimumFractionDigits
    }).format(num);
    return isNaN(num) && num !== null ? 0 : result;
  }

  setCorrectCpm() {
    this.summOfMetrics.forEach((el) => {
      if (el.title === 'TOP_BIDDERS_BY_CPM' || el.title === 'TOP_COUNTRIES_BY_CPM') {
        el.result = this.newIntlNumber((this.dataForCorrectCpm.revenue / this.dataForCorrectCpm.impressions) * 1000, 2, 2);
      }
    });
  }

  public isShowChart(chart: any): boolean {
    try {
      return !!chart.pie.datasets[0].data.length;
    } catch (error) {
      return false;
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptionOnData !== undefined) {
      this.subscriptionOnData.unsubscribe();
    }
  }
}
