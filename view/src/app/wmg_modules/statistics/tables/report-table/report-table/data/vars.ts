export const allowedDimensions = [
  'placement',
  'property',
  'pub_id',
  'publisher',
  'publisher_id',
  'size',
  'inventorytype',
  'domain',
  'origin',
  'manager',
  'country',
  'bidder',
  'ad_unit_code',
  'ad_unit_size',
  'ad_unit_type',
  'site',
  'device',
  'manager_id',
  'os',
  'browser',
  'programmatic',
  'sizes',
  'ad_type',
  'dsp_name',
  'ssp_pub_id',
  'is_hb',
  'dsp_no_content'
];

export const allowedRTBDimensions = [
  'dsp_name',
  'ad_unit',
  'pub_id',
  'ssp_pub_id',
  'country',
  'device_type',
  'size',
  'is_hb',
  'model',
  'os',
  'source_type',
  'imp_type',
  'cur',
  'connectiontype',
  'domain',
  'site_err'
];

export const allowedMetrics = [
  'requests',
  'bidder_requests',
  'impressions',
  'bids_won',
  'cpm',
  'clicks',
  'ctr',
  'revenue',
  'gross_revenue',
  'fillrate',
  'fill_rate',
  'bidder_fill_rate',
  'partnersfee',
  'programmatic',
  'size',
  'view',
  'no_ad',
  'call',
  'dsp_win',
  'click',
  'ssp_requests',
  'impression',
  'dsp_no_content',
  'viewability'
];
export const allowedMetricsIfHideReq = ['impressions', 'cpm', 'clicks', 'ctr', 'revenue', 'viewability'];

export const metricsList = [
  'requests',
  'bidder_requests',
  'impressions',
  'bids_won',
  'fillrate',
  'fill_rate',
  'bidder_fill_rate',
  'clicks',
  'ctr',
  'cpm',
  'revenue',
  'gross_revenue',
  'partnersfee',
  'view',
  'no_ad',
  'call',
  'click'
];

export const rTBMetricsList = [
  'revenue_imp',
  'cpm_imp',
  'cpm_win',
  'cpm_all',
  'ssp_requests',
  'ssp_responses',
  'dsp_requests',
  'dsp_win',
  'dsp_response',
  'dsp_timeout',
  'dsp_no_content',
  'dsp_err',
  'init',
  'impression',
  'view',
  'click',
  'ssp_fill_rate',
  'ssp_imp_fill_rate',
  'dsp_fill_rate',
  'dsp_win_fill_rate',
  'dsp_imp_fill_rate'
];

export const metricsMethods = {
  requests(metric) {
    return new Intl.NumberFormat('en-US').format(metric);
  },
  call(metric) {
    return new Intl.NumberFormat('en-US').format(metric);
  },
  bidder_requests(metric) {
    return new Intl.NumberFormat('en-US').format(metric);
  },
  ssp_requests(metric) {
    return metric;
  },
  impressions(metric) {
    return new Intl.NumberFormat('en-US').format(metric);
  },
  impression(metric) {
    return new Intl.NumberFormat('en-US').format(metric);
  },
  bids_won(metric) {
    return new Intl.NumberFormat('en-US').format(metric);
  },
  fillrate(metric) {
    return metric;
  },
  fill_rate(metric) {
    return metric;
  },
  bidder_fill_rate(metric) {
    return metric;
  },
  clicks(metric) {
    return new Intl.NumberFormat('en-US').format(metric);
  },
  ctr(metric) {
    return metric;
  },
  cpm(metric) {
    return metric;
  },
  revenue(metric) {
    return new Intl.NumberFormat('en-US', {
      minimumIntegerDigits: 1,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(metric);
  },
  gross_revenue(metric) {
    return new Intl.NumberFormat('en-US', {
      minimumIntegerDigits: 1,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(metric);
  },
  partnersfee(metric) {
    return new Intl.NumberFormat('en-US', {
      minimumIntegerDigits: 1,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(metric);
  },
  view(metric) {
    return new Intl.NumberFormat('en-US').format(metric);
  },
  no_ad(metric) {
    return new Intl.NumberFormat('en-US').format(metric);
  },
  click(metric) {
    return new Intl.NumberFormat('en-US').format(metric);
  },
  dsp_win(metric) {
    return metric;
  }
};

export const longColumn: string[] = [
  'publisher',
  'origin',
  'manager',
  'size',
  'fillrate',
  'impressions',
  'country',
  'domain',
  'dsp_name',
  'is_hb'
];
export const middleColumn: string[] = ['origin'];
export const longestColumn: string[] = [
  'property',
  'placement',
  'ad_unit_code',
  'pub_id',
  'deduction',
  'fill_rate',
  'ssp_pub_id',
  'ad_unit',
  'domain'
];
export const numericalMetrics: string[] = [
  'requests',
  'call',
  'bidder_requests',
  'impressions',
  'impression',
  'clicks',
  'revenue',
  'gross_revenue',
  'partnersfee',
  'bids_won',
  'deduction',
  'view',
  'no_ad',
  'dsp_response',
  'dsp_requests',
  'ssp_requests',
  'ssp_responses',
  'revenue_imp',
  'cpm_all',
  'cpm_win',
  'cpm_imp',
  'init',
  'dsp_err',
  'dsp_no_content',
  'dsp_timeout',
  'dsp_win',
  'dsp_fill_rate',
  'ssp_imp_fill_rate',
  'click',
  'ssp_fill_rate',
  'dsp_imp_fill_rate'
];

export const ORTB_Metrics = [
  'ssp_requests',
  'ssp_responses',
  'dsp_requests',
  'dsp_response',
  'dsp_timeout',
  'dsp_no_content',
  'dsp_err',
  'init',
  'dsp_win',
  'impressions',
  'impression',
  'view',
  'click',
  'ssp_fill_rate',
  'ssp_imp_fill_rate',
  'dsp_fill_rate',
  'dsp_win_fill_rate',
  'dsp_imp_fill_rate',
  'fill_rate',
  'cpm_imp',
  'cpm_win',
  'cpm_all',
  'cpm',
  'revenue_imp',
  'revenue'
];

export const oRtbMetricsMapping: Map<string, string> = new Map([
  ['ssp_requests', 'requests'],
  ['ssp_responses', 'responses'],
  ['ssp_fill_rate', 'fill_rate'],
  ['revenue_imp', 'revenue'],
  ['dsp_requests', 'requests'],
  ['dsp_response', 'responses'],
  ['ssp_imp_fill_rate', 'fill_rate'],
  ['dsp_fill_rate', 'fill_rate'],
  ['dsp_win_fill_rate', 'fill_rate'],
  ['dsp_imp_fill_rate', 'fill_rate'],
  ['cpm_imp', 'cpm'],
  ['cpm_win', 'cpm'],
  ['cpm_all', 'cpm']
]);
