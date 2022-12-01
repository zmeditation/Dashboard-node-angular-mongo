import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface QueryObject {
  request?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ReportViewerQueryBuilderService {
  starterObject = {};

  queryObject: QueryObject = {};

  public _basicFormHandler = new Subject<any>();

  basicFormListener$ = this._basicFormHandler.asObservable();

  public _metricsFormHandler = new Subject<any>();

  metricsFormListener$ = this._metricsFormHandler.asObservable();

  private _dimensionsHandler = new Subject<any>();

  dimensionsListener$ = this._dimensionsHandler.asObservable();

  private _filtersHandler = new Subject<any>();

  filtersListener$ = this._filtersHandler.asObservable();

  private _intervalHandler = new Subject<any>();

  intervalListener$ = this._intervalHandler.asObservable();

  public _deliveryHandler = new BehaviorSubject<any>(this.queryObject);

  deliveryListener$ = this._deliveryHandler.asObservable();

  private _queryResultsHandler = new Subject<any>();

  queryResultsListener$ = this._queryResultsHandler.asObservable();

  private _chartQueryResultsHandler = new Subject<any>();

  chartQueryResultListener$ = this._chartQueryResultsHandler.asObservable();

  private _resultContainerResetHandler = new Subject<any>();

  resultContainerResetListener$ = this._resultContainerResetHandler.asObservable();

  private _isCommissionOptionOn = new Subject<any>();

  isCommissionOptionOn$ = this._isCommissionOptionOn.asObservable();

  private _queryForDeductions = new Subject<any>();

  queryForDeductions$ = this._queryForDeductions.asObservable();

  constructor(private http: HttpClient) {
    this.basicFormListener$.subscribe((value) => {
      if (value.range !== 'custom') {
        value.dateFrom = '';
        value.dateTo = '';
      }
      if (!this.queryObject.request) { // if queryObject doesn't built yet, use a stub
        this.queryObject.request = { customRange: {} };
      }
      this.queryObject.request.type = value.type;
      this.queryObject.request.range = value.range;
      this.queryObject.request.interval = value.interval;
      this.queryObject.request.customRange.dateFrom = value.dateFrom;
      this.queryObject.request.customRange.dateTo = value.dateTo;
      this.queryObject.request.fillMissing = value.fillMissing;
      this.queryObject.request.enumerate = value.enumerate;

      this._intervalHandler.next(value.interval);

      this.sendQueryObjectToDelivery(this.queryObject);
    });

    this.metricsFormListener$.subscribe((value) => {
      this.queryObject.request.metrics = value;
      this.sendQueryObjectToDelivery(this.queryObject);
    });

    this.dimensionsListener$.subscribe((value) => {
      this.queryObject.request.dimensions = value;
      this.sendQueryObjectToDelivery(this.queryObject);
    });

    this.filtersListener$.subscribe((value) => {
      this.queryObject.request.filters = value;
      this.sendQueryObjectToDelivery(this.queryObject);
    });
  }

  sendDimensionsForm(dimensionsForm: Array<any>) {
    this._dimensionsHandler.next(dimensionsForm);
  }

  sendBasicForm(basicForm: any) {
    this._basicFormHandler.next(basicForm);
  }

  sendMetricsForm(metricsForm: Array<any>) {
    this._metricsFormHandler.next(metricsForm);
  }

  sendFiltersForm(filtersForm: Array<any>) {
    this._filtersHandler.next(filtersForm);
  }

  sendQueryObjectToDelivery(queryObject) {
    this._deliveryHandler.next(queryObject);
  }

  setQueryObjectToDelivery(queryObject) {
    Object.assign(this.queryObject, queryObject);
  }

  setStarterObject(starterObject) {
    Object.assign(this.starterObject, starterObject);
  }

  getStarterObject() {
    return this.starterObject;
  }

  postQueryToServer(reportQuery: any, type = 'default'): Observable<any> {
    this.sendQueryForDeductions(reportQuery);

    if (type === 'wbid') {
      const postUrl = `${ environment.workerApiURL_1 }/wbid/run-report`;
      return this.http.post(postUrl, reportQuery);
    } else if (type === 'default') {
      const postUrl = `${ environment.workerApiURL_1 }/reports/run-report`;
      return this.http.post(postUrl, reportQuery);
    } else if (type === 'tac') {
      const postUrl = `${ environment.workerApiURL_1 }/tac/run-report`;
      return this.http.post(postUrl, reportQuery);
    } else if (type === 'oRTB') {
      const postUrl = `${ environment.workerApiURL_1 }/rtb/run-report`;
      return this.http.post(postUrl, reportQuery);
    }
  }

  sendQueryResults(results: any) {
    this._queryResultsHandler.next(results);
  }

  sendChartQueryResults(results: any) {
    this._chartQueryResultsHandler.next(results);
  }

  sendCommissionOption(option) {
    this._isCommissionOptionOn.next(option);
  }

  resetResults(chartChecked) {
    const {
      range,
      interval,
      customRange: { dateFrom, dateTo }
    } = this.queryObject.request;
    const queryOptions = {
      type: interval,
      range: range,
      from: dateFrom,
      to: dateTo
    };

    const chartOptions = {
      chartEnabled: chartChecked
    };
    this._resultContainerResetHandler.next({ queryOptions, chartOptions });
  }

  sendQueryForDeductions(fullQuery: any) {
    this._queryForDeductions.next(fullQuery);
  }
}
