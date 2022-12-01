import { Injectable } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { AggregatedTableData, ReportElement, BuildDataParams, ReportResult, TableData } from 'shared/interfaces/reporting.interface';

import {
  allowedDimensions,
  allowedMetrics,
  allowedMetricsIfHideReq,
  metricsList,
  rTBMetricsList,
  allowedRTBDimensions,
  oRtbMetricsMapping
} from './report-table/data/vars';

@Injectable({
  providedIn: 'root'
})
export class QueryResultTableDataBuilderService {
  private permissions;

  allowedDimensions: string[] = allowedDimensions;

  allowedMetrics: string[] = allowedMetrics;

  allowedMetricsIfHideReq: string[] = allowedMetricsIfHideReq;

  metricsList: string[] = metricsList;

  rTBMetricsList: string[] = rTBMetricsList;

  allowedRTBDimensions: string[] = allowedRTBDimensions;

  reportType: string;

  oRtbMetricsMapping: Map<string, string> = oRtbMetricsMapping;

  tableData: TableData = {
    columns: [],
    data: []
  };

  constructor(private ngxPermissions: NgxPermissionsService) {
    this.permissions = this.ngxPermissions.getPermissions();
  }

  buildDataTable(args: BuildDataParams): AggregatedTableData {
    let { result, total } = args;
    const { queryType, filters, type, oRTBType } = args;
    if (type === 'ortb' && Object.keys(result[0].dimensions).length) {
      result = this.dupeCountriesReformer(result, filters);
    }

    result = this.formatMetricsArray(result);
    total = this.formatMetricsTotal(total);
    this.tableData.columns = this.getColumnNames(result, queryType, filters, type);
    this.tableData.data = this.parseResults(result, queryType);
    if (oRTBType) {
      // rewrite metrics for SSP/DSP partners
      total = this.updateMetricsDataForPartners(total);
      this.tableData.columns = this.updateMetricsListForPartners(this.tableData.columns);
      this.tableData.data = this.updateAllReportDataForPartners(this.tableData.data);
    }

    return { tableData: this.tableData, total };
  }

  formatMetricData(metric: number | string): string {
    if (metric === '---') {
      return metric.toString();
    }

    if (typeof metric === 'string') {
      return new Intl.NumberFormat('en-US').format(parseFloat(metric));
    } else if (typeof metric === 'number') {
      return new Intl.NumberFormat('en-US').format(metric);
    }
  }

  dupeCountriesReformer(result: any, filters: string[]): any {
    if (filters && filters.includes('country')) {
      return result;
    }

    const dimensions = Object.keys(result[0].dimensions);
    if (dimensions.includes('country') && dimensions.length === 1) {
      result.forEach((el) => {
        if (el.groupMetricsData[0].length === 2) {
          const target = result.filter((e) => e.dimensions.country === el.dimensions.country);
          if (target.length > 1) {
            el.metrics = QueryResultTableDataBuilderService.valuesSum(target[0].metrics, target[1].metrics);
          }
        }
      });
      return result.filter((res) => res.groupMetricsData[0].length === 2);
    } else {
      return result;
    }
  }

  static valuesSum(obj1, obj2) {
    const metrics = Object.keys(obj1);
    const result = {};
    for (const metric of metrics) {
      result[metric] = obj1[metric] + obj2[metric];
    }
    return result;
  }

  formatMetricsTotal(params: ReportElement): any {
    const data = JSON.parse(JSON.stringify(params));

    for (const metric of Object.keys(data)) {
      if (this.metricsList.indexOf(metric) !== -1 || this.rTBMetricsList.includes(metric)) {
        data[metric] = this.formatMetricData(data[metric]);
      }
    }

    data.enumeration = 'Total';
    data.date = '';
    return data;
  }

  protected formatMetricsArray(params: ReportResult[]): ReportResult[] {
    const reports: ReportResult[] = JSON.parse(JSON.stringify(params));

    reports.forEach((result) => {
      for (const metric of Object.keys(result.metrics)) {
        result.metrics[metric] = this.formatMetricData(result.metrics[metric]);
      }
    });

    return reports;
  }

  getColumnNames(queryResult: any, queryType: string, filters, type?): Array<string> {
    if (queryResult.length === 0) {
      return [];
    }

    const date = ['date'];
    const enumeration = ['enumeration'];
    const [result] = queryResult;
    let dimensions, metrics;
    if (type === 'ortb') {
      this.reportType = type;
      dimensions = Object.keys(result.dimensions).filter((dimension) => this.allowedRTBDimensions.includes(dimension));
      metrics = Object.keys(result.metrics).filter((metric) => this.rTBMetricsList.includes(metric));
    } else {
      this.reportType = '';
      dimensions = Object.keys(result.dimensions).filter((dimension) => this.allowedDimensions.includes(dimension));
      metrics = Object.keys(result.metrics).filter((metric) => {
        return this.permissions.hideRequestsAndFillrate
          ? this.allowedMetricsIfHideReq.includes(metric)
          : this.allowedMetrics.includes(metric);
      });
    }
    return result.enumerate
      ? queryType === 'total'
        ? [...enumeration, ...dimensions, ...metrics]
        : [...enumeration, ...date, ...dimensions, ...metrics]
      : queryType === 'total'
        ? [...dimensions, ...metrics]
        : [...date, ...dimensions, ...metrics];
  }

  parseResults(queryResult: any, queryType: string): [] {
    if (queryResult.length === 0) {
      return [];
    }

    // don't show total row if queryType is total
    if (!Object.keys(queryResult[0].dimensions).length && queryType === 'total') {
      return [];
    }

    if (this.reportType && this.reportType === 'ortb') {
      return queryResult.reduce((acc: Array<any>, result: any) => {
        const date = queryType === 'total' ? '' : result.date;
        const tempObject = { date };
        this.allowedRTBDimensions.forEach((dimension) => {
          if (result.dimensions[dimension]) {
            tempObject[dimension] = result.dimensions[dimension];
          }
        });
        this.rTBMetricsList.forEach((metric) => {
          if (result.metrics[metric] || result.metrics[metric] === 0) {
            tempObject[metric] = result.metrics[metric];
          }
        });
        return [...acc, tempObject];
      }, []);
    } else {
      return queryResult.reduce((acc: Array<any>, result: any) => {
        const date = queryType === 'total' ? '' : result.date;
        const tempObject = { date };
        this.allowedDimensions.forEach((dimension) => {
          if (result.dimensions[dimension]) {
            tempObject[dimension] = result.dimensions[dimension];
          }
        });

        this.permissions.hideRequestsAndFillrate
          ? this.allowedMetricsIfHideReq.forEach((metric) => {
            if (result.metrics[metric] || result.metrics[metric] === 0) {
              tempObject[metric] = result.metrics[metric];
            }
          })
          : this.allowedMetrics.forEach((metric) => {
            if (result.metrics[metric] || result.metrics[metric] === 0) {
              tempObject[metric] = result.metrics[metric];
            }
          });

        return [...acc, tempObject];
      }, []);
    }
  }

  renameKey(object: any, key: string, newKey: string): any {
    const clone = (obj) => Object.assign({}, obj);
    const clonedObj = clone(object);
    const targetKey = clonedObj[key];
    delete clonedObj[key];
    clonedObj[newKey] = targetKey;
    return clonedObj;
  }

  updateMetricsDataForPartners(data: ReportElement): ReportElement {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const newKey = this.oRtbMetricsMapping.get(key) ? this.oRtbMetricsMapping.get(key) : key;
        data = this.renameKey(data, key, newKey);
      }
    }
    return data;
  }

  updateAllReportDataForPartners(data: ReportElement[]): ReportElement[] {
    if (data.length) {
      return data.map((reportElement) => {
        return this.updateMetricsDataForPartners(reportElement);
      });
    } else {
      return data;
    }
  }

  updateMetricsListForPartners(metrics: string[]): string[] {
    return metrics.map((metric) => {
      return this.oRtbMetricsMapping.get(metric) ? this.oRtbMetricsMapping.get(metric) : metric;
    });
  }
}
