import { Component, Input, OnInit } from '@angular/core';
import { egretAnimations } from 'shared/animations/egret-animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormIntervalsType, Dimension, Filter, Metric } from 'shared/types/reports';
import { User } from 'shared/interfaces/users.interface';
import DataPrepareStatic from './data-prepare.static';

@Component({
  selector: 'app-ortb-report',
  templateUrl: './ortb-report.component.html',
  styleUrls: ['./ortb-report.component.scss'],
  animations: egretAnimations
})
export class OrtbReportComponent implements OnInit {
  @Input() user: User;

  public isChartOption = false;

  public isDownloadCSV = false;

  public perms = ['canReadOwnOrtbReports', 'canReadAllOrtbReports'];

  public rangeObjectArray: Array<FormIntervalsType> = [
    {
      name: 'TODAY',
      value: 'today',
      enabled: true
    },
    {
      name: 'YESTERDAY',
      value: 'yesterday',
      enabled: true
    },
    {
      name: 'LAST_THREE_DAYS',
      value: 'lastThreeDays',
      enabled: true
    },
    {
      name: 'LAST_SEVEN_DAYS',
      value: 'lastSevenDays',
      enabled: true
    },
    {
      name: 'MONTH_TO_YESTERDAY',
      value: 'monthToYesterday',
      enabled: true
    },
    {
      name: 'LAST_SIXTY_DAYS',
      value: 'lastSixtyDays',
      enabled: true
    },
    {
      name: 'LAST_MONTH',
      value: 'lastMonth',
      enabled: true
    },
    {
      name: 'CUSTOM',
      value: 'custom',
      enabled: true
    }
  ];

  public initialMetricsArray: Metric[] = [];

  public filtersArray: Filter[] = [];

  public starterObject;

  public queryObject;

  public initialDimensionsArray: Dimension[] = [];

  public basicForm = new FormGroup({
    type: new FormControl({ value: 'oRTB', disabled: false }),
    range: new FormControl('lastSevenDays', Validators.required),
    dateFrom: new FormControl({ value: '', disabled: true }),
    dateTo: new FormControl({ value: '', disabled: true }),
    interval: new FormControl('total', Validators.required),
    fillMissing: new FormControl(true, Validators.required),
    enumerate: new FormControl(true, Validators.required),
    ortb_type: new FormControl('')
  });

  public intervalObjectArray: Array<FormIntervalsType> = [
    {
      name: 'TOTAL',
      value: 'total',
      enabled: true
    },
    {
      name: 'MONTHLY',
      value: 'month',
      enabled: true
    },
    {
      name: 'DAILY',
      value: 'day',
      enabled: true
    }
  ];

  constructor() {}

  ngOnInit() {
    const type: string | undefined = this.user?.oRTBType || (this.user?.adWMGAdapter === true ? 'SSP' : undefined);
    this.initialMetricsArray = DataPrepareStatic.getMetricsList(type);
    this.filtersArray = DataPrepareStatic.getFiltersList(type);
    this.initialDimensionsArray = DataPrepareStatic.getDimensionsList(type);
    this.starterObject = {
      request: {
        type: 'ortb',
        range: 'lastSevenDays',
        interval: 'total',
        enumerate: true,
        fillMissing: true,
        enableExport: true,
        customRange: {
          dateFrom: '',
          dateTo: ''
        },
        metrics: DataPrepareStatic.filterInitialMetrics(type),
        filters: [],
        dimensions: []
      }
    };

    this.queryObject = {
      request: {
        type: 'ortb',
        range: 'lastSevenDays',
        interval: 'total',
        enumerate: true,
        fillMissing: true,
        enableExport: true,
        customRange: {
          dateFrom: '',
          dateTo: ''
        },
        metrics: DataPrepareStatic.filterInitialMetrics(type),
        filters: [],
        dimensions: []
      }
    };
  }
}
