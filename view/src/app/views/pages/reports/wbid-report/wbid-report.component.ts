import { Component, OnDestroy, OnInit } from '@angular/core';
import { egretAnimations } from 'shared/animations/egret-animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormIntervalsType } from 'shared/types/reports';

@Component({
  selector: 'app-wbid-tables',
  templateUrl: './wbid-report.component.html',
  styleUrls: ['./wbid-report.component.scss'],
  animations: egretAnimations
})
export class WbidReportComponent implements OnInit, OnDestroy {
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
      name: 'Bids_Won',
      value: 'bids_won',
      selected: true
    },
    {
      name: 'Gross_Revenue',
      value: 'gross_revenue',
      selected: true
    },
    {
      name: 'CPM',
      value: 'cpm',
      selected: true
    },
    {
      name: 'Requests',
      value: 'requests',
      selected: true
    },
    {
      name: 'fill_Rate',
      value: 'fill_rate',
      selected: true
    },
    {
      name: 'call',
      value: 'call',
      selected: true
    }
  ];

  public filtersArray = [
    {
      name: 'COUNTRIES',
      value: '78003',
      permissions: ['canReadWBidOwnPubsReports', 'canReadWBidAllPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'BIDDERS',
      value: '99033',
      permissions: ['canReadWBidOwnPubsReports', 'canReadWBidAllPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports'],
      selected: {
        status: '',
        values: [],
        names: []
      },
      reqBody: {
        method: 'GET',
        path: '/bidders'
      }
    },
    {
      name: 'AD_UNITS',
      value: '16710',
      permissions: ['canReadWBidOwnPubsReports', 'canReadWBidAllPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports'],
      selected: {
        status: '',
        values: [],
        names: []
      },
      reqBody: {
        method: 'POST',
        path: '/getWbidUsersById'
      }
    },
    {
      name: 'PUBLISHERS',
      value: '63509',
      permissions: ['canReadWBidAllPubsReports', 'canReadAllWBidReports', 'canReadWBidOwnPubsReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'SIZES',
      value: '29012',
      permissions: ['canReadWBidOwnPubsReports', 'canReadWBidAllPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports'],
      selected: {
        status: '',
        values: [],
        names: []
      },
      reqBody: {
        method: 'GET',
        path: '/sizes'
      }
    },
    {
      name: 'INVENTORY_TYPES',
      value: '10123',
      permissions: ['canReadWBidOwnPubsReports', 'canReadWBidAllPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'SITES',
      value: '26789',
      permissions: ['canReadWBidOwnPubsReports', 'canReadWBidAllPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports'],
      selected: {
        status: '',
        values: [],
        names: []
      },
      reqBody: {
        method: 'POST',
        path: '/getWbidUsersById'
      }
    },
    {
      name: 'DEVICES',
      value: '32356',
      permissions: ['canReadWBidOwnPubsReports', 'canReadWBidAllPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'MANAGERS',
      value: '64509',
      permissions: ['canReadWBidOwnPubsReports', 'canReadWBidAllPubsReports', 'canReadAllWBidReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'OS',
      value: '28009',
      permissions: ['canReadWBidOwnPubsReports', 'canReadWBidAllPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'BROWSERS',
      value: '28010',
      permissions: ['canReadWBidOwnPubsReports', 'canReadWBidAllPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports'],
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
      metrics: ['impressions', 'revenue', 'cpm', 'requests', 'fillRate', 'call'],
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
      metrics: ['impressions', 'revenue', 'cpm', 'requests', 'fillRate', 'call'],
      filters: [],
      dimensions: []
    }
  };

  public initialDimensionsArray = [
    {
      name: 'Country',
      value: 'country',
      selected: false,
      permissions: ['canReadWBidAllPubsReports', 'canReadWBidOwnPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports']
    },
    {
      name: 'Bidder',
      value: 'bidder',
      selected: false,
      permissions: ['canReadWBidAllPubsReports', 'canReadWBidOwnPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports']
    },
    {
      name: 'Ad_Unit',
      value: 'ad_unit_code',
      selected: false,
      permissions: ['canReadWBidAllPubsReports', 'canReadWBidOwnPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports']
    },
    {
      name: 'Publisher',
      value: 'publisher_id',
      selected: false,
      permissions: ['canReadWBidAllPubsReports', 'canReadWBidOwnPubsReports', 'canReadAllWBidReports']
    },
    {
      name: 'Size',
      value: 'ad_unit_size',
      selected: false,
      permissions: ['canReadWBidAllPubsReports', 'canReadWBidOwnPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports']
    },
    {
      name: 'Inventory_Type',
      value: 'ad_unit_type',
      selected: false,
      permissions: ['canReadWBidAllPubsReports', 'canReadWBidOwnPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports']
    },
    {
      name: 'Site',
      value: 'site',
      selected: false,
      permissions: ['canReadWBidAllPubsReports', 'canReadWBidOwnPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports']
    },
    {
      name: 'Device',
      value: 'device',
      selected: false,
      permissions: ['canReadWBidAllPubsReports', 'canReadWBidOwnPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports']
    },
    {
      name: 'Manager',
      value: 'manager_id',
      selected: false,
      permissions: ['canReadWBidAllPubsReports', 'canReadWBidOwnPubsReports', 'canReadAllWBidReports']
    },
    {
      name: 'OS',
      value: 'os',
      selected: false,
      permissions: ['canReadWBidAllPubsReports', 'canReadWBidOwnPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports']
    },
    {
      name: 'Browsers',
      value: 'browser',
      selected: false,
      permissions: ['canReadWBidAllPubsReports', 'canReadWBidOwnPubsReports', 'canReadAllWBidReports', 'canReadOwnWBidReports']
    }
  ];

  public basicForm = new FormGroup({
    type: new FormControl({ value: 'WBID', disabled: false }),
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
