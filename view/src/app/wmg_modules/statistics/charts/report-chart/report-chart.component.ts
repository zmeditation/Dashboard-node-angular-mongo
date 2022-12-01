import { Component, Input, OnChanges } from '@angular/core';
import { ReportChartVariables } from './helpers/report-chart-variables';
import { EventCollectorService } from "shared/services/event-collector/event-collector.service";
import { egretAnimations } from "shared/animations/egret-animations";
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-report-chart',
  templateUrl: './report-chart.component.html',
  styleUrls: ['./report-chart.component.scss'],
  animations: egretAnimations
})
export class ReportChartComponent extends ReportChartVariables implements OnChanges {
  queryOption: string;

  public lineChartLabels: Array<any> = ['Empty'];

  private hideReqAndFiilPermission;

  @Input() chartData: any;

  constructor(public event: EventCollectorService, public NgxPermissionsS: NgxPermissionsService) {
    super();
  }

  ngOnChanges(changes) {
    const responseData = changes.chartData.currentValue.filterResult;
    this.hideReqAndFiilPermission = !!this.NgxPermissionsS.getPermissions().hideRequestsAndFillrate;
    if (responseData !== undefined) { this.updateChartData(responseData, responseData.length); } 

  }

  updateChartData(object, length) {
    length < 2 ? (this.lineChartType = 'bar') : (this.lineChartType = 'line');
    this.lineChartLabels = [];
    const labelsArr = [];
    const prop1Arr = [];
    const prop2Arr = [];
    const prop3Arr = [];
    const prop4Arr = [];
    const propName = ['Revenue', 'Impressions', 'eCPM', 'Fill rate'],
      propData = [prop1Arr, prop2Arr, prop3Arr, prop4Arr];

    this.hideReqAndFiilPermission ? propName.pop() : propName;
    this.hideReqAndFiilPermission ? propData.pop() : propData;
    object.forEach((day) => {
      labelsArr.push(day.date.split('-').splice(1, 2).join('.'));
      prop1Arr.push(day.metrics.revenue);
      prop2Arr.push(day.metrics.impressions);
      prop3Arr.push(day.metrics.cpm);
      prop4Arr.push(day.metrics.fillrate);
    });
    this.lineChartSteppedData = [];
    this.chartMethods.updateLineChartData(this.lineChartSteppedData, propData, propName);
    this.lineChartLabels = labelsArr;
  }
}
