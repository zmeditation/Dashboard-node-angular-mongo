import { AfterContentInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ReportTableFilterService } from '../report-table-filter.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { longColumn, middleColumn, longestColumn, numericalMetrics, ORTB_Metrics } from './data/vars';
import { Router } from '@angular/router';
import { ReportElement } from 'shared/interfaces/reporting.interface';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})
export class ReportTableComponent implements OnInit, AfterContentInit, OnDestroy, OnChanges {
  @Input() tableData;

  @Input() totalData;

  @Input() enablePagination: boolean;

  @Input() customPaginationSize: number;

  @Input() sortField;

  @Input() sortDirection;

  @Input() typeReport: string;

  Subscribers: Subscription[] = [];

  displayedColumns: string[] = [];

  columnsToDisplay: string[] = this.displayedColumns.slice();

  data: MatTableDataSource<ReportElement> = new MatTableDataSource();

  hidePaginator = true;

  paginatorSize = 25;

  sortedTableData: ReportElement[];

  isLoading = true;

  reportFileName: string;

  longColumn = longColumn;

  middleColumn = middleColumn;

  longestColumn = longestColumn;

  numericalMetrics = numericalMetrics;

  get noDataFound() {
    return !this.tableData.data.length && !this.tableData.columns.length;
  }

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) {
    if (!value) return;
    value._intl.itemsPerPageLabel = 'Items:';
    this.data.paginator = value;
  }

  @ViewChild(MatSort) set sort(value: MatSort) {
    if (!value) return;
    this.data.sort = value;
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private tableFilterService: ReportTableFilterService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngAfterContentInit(): void {
    if (this.noDataFound) return;

    if (this.typeReport === 'wbid') {
      this.displayedColumns = this.sortOfColumns(this.tableData.columns);
    } else {
      this.displayedColumns = this.tableData.columns;
    }

    this.columnsToDisplay = this.displayedColumns.slice();

    if (this.typeReport === 'oRTB') {
      // sort columns of ORTB table in right order
      this.sortOrtbColumns(this.columnsToDisplay);
    }
    setTimeout(() => {
      if (this.sortField && this.sortDirection) {
        this.data.sort.sort(<MatSortable>{
          id: this.sortField,
          start: this.sortDirection
        });
      } else {
        this.data.sort.sort(<MatSortable>{
          id: 'date',
          start: 'desc'
        });
      }

      this.sortedTableData = this.data.sortData(this.data.filteredData, this.data.sort);
      this.sortedTableData !== undefined ? this.enumerating(this.sortedTableData) : this.enumerating([]);
    }, 0);
    this.checkAndSetColumns(this.longestColumn, this.columnsToDisplay);
  }

  ngOnChanges(): void {
    this.isLoading = false;
  }

  columnTextLength(column: string): boolean {
    // if column name too long, it should be white-space: 'nowrap' styled
    // return true if column very long
    return (
      this.translate.instant('REPORT_MANAGEMENT_PAGE.REPORT_VIEWER.REPORT_RESULTS.' + column.toUpperCase()).length > 15 &&
      this.columnsToDisplay.length > 16 &&
      column.includes('fill')
    );
  }

  ngOnInit() {
    if (this.customPaginationSize) {
      this.paginatorSize = this.customPaginationSize;
    }

    if (this.enablePagination === true) {
      this.hidePaginator = false;
    }

    this.data.data = this.tableData.data;
    this.Subscribers.push(
      this.tableFilterService.reportFilterListener$.subscribe((value) => {
        this.applyFilter(value);
      })
    );
    this.sortingData();
    this.checkAndSetColumns(this.longestColumn, this.columnsToDisplay);

    // set file name for report, including type, current date and random hash for unique file names
    this.reportFileName = `adwmg-report-${this.typeReport ? this.typeReport : 'main'}-
    ${new Date().toISOString().substr(0, 10)}-
    ${Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 5)}`;
  }

  sortingData(): void {
    this.data.sortingDataAccessor = (item: ReportElement, property: string) => {
      if (this.numericalMetrics.includes(property)) {
        return ('' + item[property]).includes(',') ? +item[property].replace(/,/g, '') : +item[property];
      } else {
        return item[property];
      }
    };
  }

  get isMobile(): boolean {
    return this.breakpointObserver.isMatched('(max-width: 767px)');
  }

  get isDownloadButtonShown(): boolean {
    if (this.typeReport === undefined) {
      return false;
    } else {
      return this.router.url !== '/dashboard';
    }
  }

  applyFilter(filterValue: string): void {
    this.data.filter = filterValue.trim().toLowerCase();

    if (this.data.paginator) {
      this.data.paginator.firstPage();
    }
  }

  enumerating(obj): void {
    const length: number = obj !== undefined ? obj.length : 0;
    for (let i = 0; i < length; i++) {
      obj[i].enumeration = i + 1;
    }
  }

  sortOfColumns(columns: string[]): string[] {
    const necessary = columns.includes('bidder_requests')
      ? ['call', 'bidder_requests', 'bids_won', 'bidder_fill_rate', 'cpm', 'gross_revenue'].filter((el) => columns.includes(el))
      : ['call', 'requests', 'bids_won', 'fill_rate', 'cpm', 'gross_revenue'].filter((el) => columns.includes(el));
    const result = columns
      .map((el) => {
        if (!necessary.includes(el)) {
          return el;
        }
      })
      .filter((el) => el !== undefined);
    necessary.forEach((el) => {
      result.push(el);
    });
    return result;
  }

  sortOrtbColumns(columns: string[]): string[] {
    return columns.sort((a, b) => {
      // ORTB_Metrics contains metrics in correct order
      // so, element with bigger index goes to the end of array, with lower - to the start
      return ORTB_Metrics.indexOf(a) - ORTB_Metrics.indexOf(b);
    });
  }

  checkAndSetColumns(needContain: string[], exists: string[], ifTrueWillSetInLongest = 'enumeration'): boolean {
    const isContainLongestColumn = exists.some((str) => needContain.includes(str) && str !== ifTrueWillSetInLongest);

    if (isContainLongestColumn === false && !this.longestColumn.includes(ifTrueWillSetInLongest)) {
      this.longestColumn.push(ifTrueWillSetInLongest);
    } else {
      this.longestColumn = this.longestColumn.filter((el) => el !== ifTrueWillSetInLongest);
    }

    if (exists.length) {
      this.longestColumn.push(exists[0]);
    }

    // enumeration and date shouldn't be longest column in RTB reports, except when low quantity of metrics selected
    if (this.typeReport === 'oRTB' && this.columnsToDisplay.length > 6) {
      this.longestColumn = this.longestColumn.filter((column) => column !== 'enumeration' && column !== 'date');
    }
    return isContainLongestColumn;
  }

  ngOnDestroy(): void {
    this.Subscribers.forEach((el) => el.unsubscribe());
  }
}
