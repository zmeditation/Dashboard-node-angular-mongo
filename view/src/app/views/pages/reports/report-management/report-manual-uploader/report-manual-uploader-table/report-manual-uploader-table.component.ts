import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReportManualUploaderComponent } from '../report-manual-uploader.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportManualUploaderService } from '../../report-services/report-manual-uploader.service';
import { ReportServiceDataService } from '../../report-services/report-service-data.service';
import { Subscription } from 'rxjs/Subscription';
import { ManualLastTableData } from '../helpers/manual-last-table-data';

export interface Property {
  property: {
    domain: string;
    property_id: string;
    refs_to_user: string;
    am: string;
  };
  day: string;
  tags: string;
  inventory_type: string;
  inventory_sizes: string;
  ad_request: number;
  matched_request: number;
  clicks: number;
  ecpm: number;
  report_origin: string;
}

@Component({
  selector: 'app-report-manual-uploader-table',
  templateUrl: './report-manual-uploader-table.component.html',
  styleUrls: ['./report-manual-uploader-table.component.scss']
})
export class ReportManualUploaderTableComponent extends ManualLastTableData implements OnInit, OnDestroy {
  @Input('isLastUploads') userid: string;

  public displayedColumns = [
    '№',
    'Publisher',
    'Property',
    'Domain',
    'Type',
    'Programmatic',
    'Day',
    'Sizes',
    'Requests',
    'Impressions',
    'Clicks',
    'eCPM',
    'Delete'
  ];

  public dataSource;

  public sourceForReport: Property[];

  public isTable = false;

  mySubscriptionOnAdd: Subscription;

  mySubscriptionOnSend: Subscription;

  constructor(
    public snackBar: MatSnackBar,
    public reportManualUploaderService: ReportManualUploaderService,
    public reportManualUploaderComponent: ReportManualUploaderComponent,
    public reportServiceDataService: ReportServiceDataService
  ) {
    super(snackBar, reportManualUploaderService);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Property[]>([]);
    this.addProperty();
  }

  addProperty() {
    this.mySubscriptionOnAdd = this.reportServiceDataService.property.subscribe((properties) => {
      if (properties === null) { return; }

      // console.log(properties);

      this.dataSource = new MatTableDataSource<Property[]>(properties);
      this.sourceForReport = this.dataSource.data;
      this.isTable = true;
    });
  }

  public sendDataToServer() {
    if (this.sourceForReport.length >= 1) {
      this.mySubscriptionOnSend = this.reportManualUploaderService.postDataToServer(this.sourceForReport).subscribe((res: any) => {
        if (res.success) {
          this.reportManualUploaderComponent.rows = [];
          this.dataSource = new MatTableDataSource<Property[]>([]);
          this.sourceForReport = this.dataSource.data;
          this.openSnackBarSuccess('Upload successful', '');
          this.isTable = false;
          this.reportServiceDataService.sendStatus(res.success);
        } else {
          this.openSnackBarFailure('Upload failure', '');
        }
      });
    }


  }

  clearAllTable() {
    this.dataSource = new MatTableDataSource<Property[]>([]);
    this.sourceForReport = this.dataSource.data;
    this.reportManualUploaderComponent.rows = [];
    this.isTable = false;
  }

  deleteOneRow(ind) {
    this.reportManualUploaderComponent.rows.splice(ind, 1);
    this.reportServiceDataService.sendProperty(this.reportManualUploaderComponent.rows);

    if (this.sourceForReport.length === 0) { this.isTable = false; }

  }

  openSnackBarSuccess(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['mat-bg-accent']
    });
  }

  openSnackBarFailure(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['mat-bg-warn']
    });
  }

  ngOnDestroy() {
    if (this.mySubscriptionOnAdd !== undefined) { this.mySubscriptionOnAdd.unsubscribe(); }

    if (this.mySubscriptionOnSend !== undefined) { this.mySubscriptionOnSend.unsubscribe(); }

  }
}
