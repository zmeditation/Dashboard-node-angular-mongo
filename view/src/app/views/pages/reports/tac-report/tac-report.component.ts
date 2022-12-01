import { Component, OnDestroy, OnInit } from '@angular/core';
import { egretAnimations } from 'shared/animations/egret-animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormIntervalsType } from 'shared/types/reports';

@Component({
  selector: 'app-tac-report',
  templateUrl: './tac-report.component.html',
  styleUrls: ['./tac-report.component.scss'],
  animations: egretAnimations
})
export class TacReportComponent implements OnInit, OnDestroy {
  public isChartOption = false;

  public isDownloadCSV = false;

  public rangeObjectArray: Array<FormIntervalsType> = [
    {
      name: 'TODAY',
      value: 'today'
    },
    {
      name: 'YESTERDAY',
      value: 'yesterday'
    },
    {
      name: 'LAST_THREE_DAYS',
      value: 'lastThreeDays'
    },
    {
      name: 'LAST_SEVEN_DAYS',
      value: 'lastSevenDays'
    },
    {
      name: 'MONTH_TO_YESTERDAY',
      value: 'monthToYesterday'
    },
    {
      name: 'LAST_SIXTY_DAYS',
      value: 'lastSixtyDays'
    },
    {
      name: 'LAST_MONTH',
      value: 'lastMonth'
    },
    {
      name: 'CUSTOM',
      value: 'custom'
    }
  ];

  public initialMetricsArray = [
    {
      name: 'Requests',
      value: 'requests',
      selected: true
    },
    {
      name: 'Impressions',
      value: 'impressions',
      selected: true
    },
    {
      name: 'Views',
      value: 'view',
      selected: true
    },
    {
      name: 'Clicks',
      value: 'clicks',
      selected: true
    },
    {
      name: 'No_ad',
      value: 'no_ad',
      selected: false
    }
  ];

  public filtersArray = [
    {
      name: 'COUNTRIES',
      value: '78003',
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'PROGRAMMATICS',
      value: '65231',
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'AD_UNITS',
      value: '77081',
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'PUBLISHERS',
      value: '63508',
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'SIZES',
      value: '29012',
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'INVENTORY_TYPES',
      value: '17695',
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'SITES',
      value: '97677',
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'DEVICES',
      value: '32356',
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'MANAGERS',
      value: '64509',
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'OS',
      value: '28009',
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'BROWSERS',
      value: '28010',
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    }
  ];

  public starterObject = {
    request: {
      type: 'analytics',
      range: 'lastSevenDays',
      interval: 'total',
      enumerate: true,
      fillMissing: true,
      enableExport: true,
      customRange: {
        dateFrom: '',
        dateTo: ''
      },
      metrics: ['requests', 'impressions', 'view', 'clicks'],
      filters: [],
      dimensions: []
    }
  };

  public queryObject = {
    request: {
      type: 'analytics',
      range: 'lastSevenDays',
      interval: 'total',
      enumerate: true,
      fillMissing: true,
      enableExport: true,
      customRange: {
        dateFrom: '',
        dateTo: ''
      },
      metrics: ['requests', 'impressions', 'view', 'clicks'],
      filters: [],
      dimensions: []
    }
  };

  public initialDimensionsArray = [
    {
      name: 'Country',
      value: 'country',
      selected: false,
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports']
    },
    {
      name: 'Programmatic',
      value: 'programmatic',
      selected: false,
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports']
    },
    {
      name: 'Ad_Unit',
      value: 'ad_unit_code',
      selected: false,
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports']
    },
    {
      name: 'Publisher',
      value: 'pub_id',
      selected: false,
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports']
    },
    {
      name: 'Size',
      value: 'sizes',
      selected: false,
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports']
    },
    {
      name: 'Inventory_Type',
      value: 'ad_type',
      selected: false,
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports']
    },
    {
      name: 'Domain',
      value: 'domain',
      selected: false,
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports']
    },
    {
      name: 'Device',
      value: 'device',
      selected: false,
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports']
    },
    {
      name: 'Manager',
      value: 'manager_id',
      selected: false,
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports']
    },
    {
      name: 'OS',
      value: 'os',
      selected: false,
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports']
    },
    {
      name: 'Browsers',
      value: 'browser',
      selected: false,
      permissions: ['canReadOwnTacReports', 'canReadAllTacReports']
    }
  ];

  public basicForm = new FormGroup({
    type: new FormControl({ value: 'TAC', disabled: false }),
    range: new FormControl('lastSevenDays', Validators.required),
    dateFrom: new FormControl({ value: '', disabled: true }),
    dateTo: new FormControl({ value: '', disabled: true }),
    interval: new FormControl('total', Validators.required),
    fillMissing: new FormControl(true, Validators.required),
    enumerate: new FormControl(true, Validators.required)
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

  requestSubscription: Subscription[] = [];

  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.requestSubscription.forEach((subscription) => subscription.unsubscribe());
  }
}
