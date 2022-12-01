import { Metric, Filter, Dimension } from 'shared/types/reports';

export default class DataPrepareStatic {
  constructor() {}

  public static metrics: string[] = [
    'dsp_requests',
    'ssp_requests',
    'dsp_response',
    'ssp_responses',
    'impression',
    'revenue_imp',
    'dsp_fill_rate',
    'ssp_fill_rate'
  ];

  public static perms = ['canReadOwnOrtbReports', 'canReadAllOrtbReports'];

  public static specificMetrics: Metric[] = [
    {
      name: 'SSP_Requests',
      value: 'ssp_requests',
      selected: true
    },
    {
      name: 'DSP_Requests',
      value: 'dsp_requests',
      selected: true
    },
    {
      name: 'SSP_Responses',
      value: 'ssp_responses',
      selected: true
    },
    {
      name: 'DSP_Responses',
      value: 'dsp_response',
      selected: true
    },
    {
      name: 'DSP_Timeout',
      value: 'dsp_timeout',
      selected: false
    },
    {
      name: 'DSP_Wins',
      value: 'dsp_win',
      selected: false
    },
    {
      name: 'SSP_Fill_rate',
      value: 'ssp_fill_rate',
      selected: true
    },
    {
      name: 'SSP_Imp_Fill_rate',
      value: 'ssp_imp_fill_rate',
      selected: false
    },
    {
      name: 'DSP_Fill_rate',
      value: 'dsp_fill_rate',
      selected: true
    },
    {
      name: 'DSP_Win_Fill_rate',
      value: 'dsp_win_fill_rate',
      selected: false
    },
    {
      name: 'DSP_Imp_Fill_rate',
      value: 'dsp_imp_fill_rate',
      selected: false
    }
  ];

  public static commonMetricsArray: Metric[] = [
    {
      name: 'Revenue',
      value: 'revenue_imp',
      selected: true
    },
    {
      name: 'CPM_Imp',
      value: 'cpm_imp',
      selected: false
    },
    {
      name: 'CPM_Win',
      value: 'cpm_win',
      selected: false
    },
    {
      name: 'CPM_All',
      value: 'cpm_all',
      selected: false
    },
    {
      name: 'Impressions',
      value: 'impression',
      selected: true
    }
  ];

  public static metricsForAdminsOnly: string[] = [
    'cpm_win',
    'cpm_all', 'dsp_win',
    'dsp_timeout',
    'dsp_fill_rate',
    'dsp_win_fill_rate',
    'dsp_imp_fill_rate',
    'ssp_imp_fill_rate',
    'ssp_fill_rate'
  ];

  public static commonFilters: Filter[] = [
    {
      name: 'DOMAINS',
      value: '97677',
      permissions: DataPrepareStatic.perms,
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'SOURCES',
      value: '11522',
      permissions: DataPrepareStatic.perms,
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    /*    {
      name: 'SSP',
      value: '25369',
      permissions: this.perms,
      selected: {
        status: '',
        values: [],
        names: []
      }
    },*/
    {
      name: 'IMPRESSION_TYPES',
      value: '17695',
      permissions: DataPrepareStatic.perms,
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'DEVICES',
      value: '32356',
      permissions: DataPrepareStatic.perms,
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'OS',
      value: '28009',
      permissions: DataPrepareStatic.perms,
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'COUNTRIES',
      value: '78003',
      permissions: DataPrepareStatic.perms,
      selected: {
        status: '',
        values: [],
        names: []
      }
    }
  ];

  public static specificFilters: Filter[] = [
    {
      name: 'SIZES',
      value: '29012',
      permissions: DataPrepareStatic.perms,
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    /*    {
          name: 'AD_UNITS',
          value: '77081',
          permissions: DataPrepareHelper.perms,
          selected: {
            status: '',
            values: [],
            names: []
          }
        },*/
    {
      name: 'PUBLISHERS',
      value: '63508',
      permissions: DataPrepareStatic.perms,
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'DSP',
      value: '89564',
      permissions: DataPrepareStatic.perms,
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'IS_HB',
      value: '77554',
      permissions: DataPrepareStatic.perms,
      selected: {
        status: '',
        values: [],
        names: []
      }
    },
    {
      name: 'CURRENCIES',
      value: '13371',
      permissions: DataPrepareStatic.perms,
      selected: {
        status: '',
        values: [],
        names: []
      }
    }
  ];

  public static commonDimensions: Dimension[] = [
    {
      name: 'Country',
      value: 'country',
      selected: false,
      permissions: DataPrepareStatic.perms
    },
    {
      name: 'Source',
      value: 'source_type',
      selected: false,
      permissions: DataPrepareStatic.perms
    },
    {
      name: 'IMPRESSION_TYPE',
      value: 'imp_type',
      selected: false,
      permissions: DataPrepareStatic.perms
    },
    {
      name: 'Device',
      value: 'device_type',
      selected: false,
      permissions: DataPrepareStatic.perms
    },
    {
      name: 'OS',
      value: 'os',
      selected: false,
      permissions: DataPrepareStatic.perms
    },
    {
      name: 'Domain',
      value: 'domain',
      selected: false,
      permissions: DataPrepareStatic.perms
    }
  ];

  public static specificDimensions = [
    {
      name: 'IS_HB',
      value: 'is_hb',
      selected: false,
      permissions: DataPrepareStatic.perms
    },
    {
      name: 'Currency',
      value: 'cur',
      selected: false,
      permissions: DataPrepareStatic.perms
    },
    {
      name: 'DSP',
      value: 'dsp_name',
      selected: false,
      permissions: DataPrepareStatic.perms
    },
    {
      name: 'Ad_Unit',
      value: 'ad_unit',
      selected: false,
      permissions: DataPrepareStatic.perms
    },
    {
      name: 'Publisher',
      value: 'pub_id',
      selected: false,
      permissions: DataPrepareStatic.perms
    },
    {
      name: 'SSP_Pub',
      value: 'ssp_pub_id',
      selected: false,
      permissions: DataPrepareStatic.perms
    },
    {
      name: 'Size',
      value: 'size',
      selected: false,
      permissions: DataPrepareStatic.perms
    }
  ];

  static getMetricsList(typeOfPartner?: string): Metric[] {
    if (!typeOfPartner) {
      return this.commonMetricsArray.concat(this.specificMetrics).sort((a, b) => a.name.localeCompare(b.name));
    }

    const selectedMetrics = this.specificMetrics.filter((metric) => metric.name.includes(typeOfPartner));
    return this.commonMetricsArray
      .concat(selectedMetrics)
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((metric) => !this.metricsForAdminsOnly.includes(metric.value))
      .map((metric) => {
        return {
          name: metric.name.replace(/([DS]SP_)/g, ''),
          value: metric.value,
          selected: true
        };
      });
  }

  static getFiltersList(typeOfPartner?: string): Filter[] {
    if (!typeOfPartner) {
      return this.commonFilters.concat(this.specificFilters).sort((a, b) => a.name.localeCompare(b.name));
    }

    return typeOfPartner === 'SSP'
      ? this.commonFilters.sort((a, b) => a.name.localeCompare(b.name))
      : this.commonFilters.filter((filter) => filter.name !== 'DOMAINS').sort((a, b) => a.name.localeCompare(b.name));
  }

  static getDimensionsList(typeOfPartner?: string): Dimension[] {
    if (!typeOfPartner) {
      return this.commonDimensions.concat(this.specificDimensions).sort((a, b) => a.name.localeCompare(b.name));
    }

    return typeOfPartner === 'SSP'
      ? this.commonDimensions.sort((a, b) => a.name.localeCompare(b.name))
      : this.commonDimensions.filter((dimension) => dimension.name !== 'Domain').sort((a, b) => a.name.localeCompare(b.name));
  }

  static filterInitialMetrics(typeOfPartner?: string): string[] {
    if (!typeOfPartner) {
      return this.metrics;
    }

    return typeOfPartner === 'SSP'
      ? this.metrics.filter((metric) => !metric.includes('dsp'))
      : this.metrics.filter((metric) => !metric.includes('ssp'));
  }
}
