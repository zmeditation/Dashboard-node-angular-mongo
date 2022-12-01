import { Component, OnInit } from '@angular/core';
import { egretAnimations } from 'shared/animations/egret-animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxPermissionsService } from 'ngx-permissions';
import { DeductionService } from 'shared/services/cruds/deduction.service';
import { FormIntervalsType } from 'shared/types/reports';

@Component({
  selector: 'app-report-viewer-main',
  templateUrl: './report-viewer-main.component.html',
  styleUrls: ['./report-viewer-main.component.scss'],
  animations: egretAnimations
})
export class ReportViewerMainComponent implements OnInit {
  public isChartOption = true;

  public allowedMetricsIfHB = ['impressions', 'cpm', 'clicks', 'ctr', 'revenue'];

  public isOptionForCommission = true;

  public isCommissionOn = false;

  public isDownloadCSV = true;

  public rangeObjectArray: Array<FormIntervalsType> = [
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
      name: 'Impressions',
      value: 'impressions',
      selected: true
    },
    {
      name: 'Clicks',
      value: 'clicks',
      selected: true
    },
    {
      name: 'CTR',
      value: 'ctr',
      selected: true
    },
    {
      name: 'Revenue',
      value: 'revenue',
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
      name: 'Fill_Rate',
      value: 'fillRate',
      selected: true
    },
    {
      name: 'Viewability',
      value: 'viewability',
      selected: true
    }
  ];

  public filtersArray = [
    {
      name: 'PROPERTIES',
      value: '16708',
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'PLACEMENTS',
      value: '16505',
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'INVENTORY_TYPES',
      value: '10123',
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'SIZES',
      value: '29002',
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'PUBLISHERS',
      value: '63508',
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'DOMAINS',
      value: '97677',
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'ORIGINS',
      value: '31583',
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports'],
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'MANAGERS',
      value: '64509',
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports'],
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
      metrics: ['impressions', 'clicks', 'ctr', 'revenue', 'cpm', 'requests', 'fillRate', 'viewability'],
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
      metrics: ['impressions', 'clicks', 'ctr', 'revenue', 'cpm', 'requests', 'fillRate', 'viewability'],
      filters: [],
      dimensions: []
    }
  };

  public initialDimensionsArray = [
    {
      name: 'Property',
      value: 'property',
      selected: false,
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports']
    },
    {
      name: 'Placement',
      value: 'placement',
      selected: false,
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports']
    },
    {
      name: 'Inventory_Type',
      value: 'inventoryType',
      selected: false,
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports']
    },
    {
      name: 'Size',
      value: 'size',
      selected: false,
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports']
    },
    {
      name: 'Publisher',
      value: 'publisher',
      selected: false,
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports']
    },
    {
      name: 'Domain',
      value: 'domain',
      selected: false,
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports', 'canReadOwnReports']
    },
    {
      name: 'Origin',
      value: 'origin',
      selected: false,
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports']
    },
    {
      name: 'Manager',
      value: 'manager',
      selected: false,
      permissions: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports']
    }
  ];

  public basicForm = new FormGroup({
    type: new FormControl({ value: 'main', disabled: false }),
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
      name: 'DAILY',
      value: 'daily',
      enabled: true
    },
    {
      name: 'MONTHLY',
      value: 'monthly',
      enabled: true
    }
  ];

  constructor(
    private ngxPermissions: NgxPermissionsService,
    public deductionService: DeductionService
  ) {
    const permissions = this.ngxPermissions.getPermissions();
    this.isOptionForCommission = !permissions.canReadOwnReports && !permissions.prebidUserWbid && !permissions.postbidUserWbid;
  }

  ngOnInit() {}
}
