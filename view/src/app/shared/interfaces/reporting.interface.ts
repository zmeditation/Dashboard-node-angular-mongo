import { DeductionType } from '../constants/deduction-type.enum'

export type DateRange = {
  dateFrom: string;
  dateTo: string;
}

export type QueryDeduction = {
  query?: {
    publishersId: string[];
    managersId: string[];
    range: string;
    customRange: DateRange;
  };
  failure?: string;
}

export type Filter = {
  filterId: string;
  name: string;
  type: string;
  values: string[];
}

export type IncomingQuery = {
  request: {
    customRange: DateRange;
    dimensions: string[];
    enableExport: boolean;
    enumerate: boolean;
    fillMissing: boolean;
    filters: Filter[];
    interval: string;
    metrics: string;
    range: string;
    type: string;
  };
}

export type ReportInfo = {
  type?: string;
  range?: string;
  from?: string;
  to?: string;
}

export type Deduction = {
  type?: DeductionType,
  date: string;
  deduction: number;
}

export type PublishersData = {
  deductions: Deduction[];
  refs_to_user: {
    _id: string;
    am: string;
    enabled: boolean;
    name: string;
  };
}

export type SuccessAnswerDeduction = {
  error: null;
  publishers: PublishersData[];
  success: boolean;
}

export type UnSuccessAnswerDeduction = {
  error: {
    msg: string;
    success: boolean;
  };
  headers: any;
}

export type SSP = {
  enable: boolean;
  id: number;
  name: string;
}

export type ReceivedFilterObject = {
  error?: null | {
    msg: string;
  };
  name: string;
  results: string[] | SSP[];
  success: boolean;
}

export type FilteredValues = {
  name: string;
  id: string;
  selected: boolean;
}

export type TableData = {
  columns: Array<string>;
  data: Array<any>;
}

export type Metric = {
  name: string;
  selected: boolean;
  value: string;
}

export type ReportElement = {
  number?: number;
  date?: any;
  interval: string;
  publisher?: any;
  domain?: string;
  origin?: string;
  placement?: string;
  manager?: string;
  size?: string;
  type?: string;
  CPM?: number;
  CTR?: number;
  Clicks?: number;
  Impressions?: number;
  Requests?: number;
  FillRate?: number;
  Revenue?: number;
  partnersFee?: number;
}

export enum PeriodName {
  yesterday = 'yesterday',
  lastThreeDays = 'lastThreeDays',
  lastSevenDays = 'lastSevenDays',
  lastSixtyDays = 'lastSixtyDays',
  monthToYesterday = 'monthToYesterday',
  lastMonth = 'lastMonth'
}

export type Period = {
  periodName: string;
  value: PeriodName;
}

export type SortingOptions = {
  optionName: string;
  value: string;
}

export type QueryType = {
  optionName: string;
  value: string;
}

export type RTBMetric = {
  clicks?: number;
  cpm?: number;
  ctr?: number;
  fillrate?: number;
  impressions?: number;
  requests?: number;
  revenue?: number;
  click?: number;
  cpm_imp?: number;
  dsp_requests?: number;
  dsp_response?: number;
  impression?: number;
  revenue_imp?: number;
  ssp_imp_fill_rate?: number;
  ssp_requests?: number;
  ssp_responses?: number;
  view?: number;
}

export type ReportsData = {
  date?: string;
  interval?: string;
  dimensions?: Dimension;
  metrics?: RTBMetric;
  groupMetricsData?: string[];
}

export type BuildDataParams = {
  result?: ReportResult[];
  queryType?: string;
  total?: ReportElement;
  filters?: any;
  type?: string;
  oRTBType?: string;
}

export type ReportResult = {
  date?: string;
  interval?: string;
  dimensions?: Dimension;
  metrics?: Metrics;
  enumerate?: boolean;
  enumeration?: string;
}

type Dimension = {
  [key: string]: number | string;
}
type Metrics = {
  [key: string]: number | string;
}

export type ChartDataObject = {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth: number;
  consolidated: string;
  data: number[];
  fill: boolean;
  hoverBackgroundColor?: string;
  hoverBorderColor?: string;
  label: string;
  options: any;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointBorderWidth?: number;
  pointHoverBackgroundColor?: string;
  pointHoverBorderColor?: string;
  pointRadius?: number;
  spanGaps: boolean;
  value_label: string;
}

export type QueryObject = {
  chartData: ReportsData[];
  tableData: {
    data: ReportsData[];
    total: ReportElement | any;
  };
}

export type ChartQueryObject = {
  result: {
    pie: {
      chartOptions?: {
        responsive: boolean;
        maintainAspectRatio: boolean;
        legend: any;
        layout: any;
        rotation: number;
        scales: any;
        tooltips: any;
      };
      datasets: {
        backgroundColor: string[];
        borderColor: string[];
        data: number[];
        hoverBackgroundColor: string[];
        hoverBorderColor: string[];
        _meta?: any;
      }[];
      isData: boolean;
      labels: string[];
      title: string;
      type: string;
    };
    line: {
      chartOptions?: {
        responsive: boolean;
        maintainAspectRatio: boolean;
        legend: any;
        layout: any;
        rotation: number;
        scales: any;
        tooltips: any;
      };
      datasets: { data: number[]; dates: string[]; label: string }[];
      isData: boolean;
      labels: string[];
      title: string;
      type: string;
    };
    finishLength: number;
  };
  success: boolean;
}

export type AggregatedTableData = {
  tableData: TableData,
  total: ReportElement
}
