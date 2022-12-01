import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Property } from '../report-manual-uploader-table/report-manual-uploader-table.component';
import { ReportManualUploaderService } from '../../report-services/report-manual-uploader.service';
import { ManualLastTableData } from '../helpers/manual-last-table-data';
import { ReportServiceDataService } from '../../report-services/report-service-data.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-report-last-manual-uploads',
  templateUrl: './report-last-manual-uploads.component.html',
  styleUrls: ['./report-last-manual-uploads.component.scss']
})
export class ReportLastManualUploadsComponent extends ManualLastTableData implements OnInit, OnDestroy {
  public columnsForLastUploads = [
    '№',
    // 'Publisher',
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

  mySubscribeOnLastUploads: Subscription;

  constructor(
    public snackBar: MatSnackBar,
    public reportManualUploaderService: ReportManualUploaderService,
    public reportServiceDataService: ReportServiceDataService
  ) {
    super(snackBar, reportManualUploaderService);
  }

  ngOnInit() {
    this.getLastUploads();
    this.mySubscribeOnLastUploads = this.reportServiceDataService.status.subscribe((status) => {
      // console.log(status);
      if (status) { this.getLastUploads(); }

    });
  }

  deleteLastUploadsProperties(obj) {
    this.reportManualUploaderService.deleteLastPostedProperties(obj._id).subscribe((properties: any) => {
      if (properties.success === false) { return; }

      const indObj = this.lastUploadsSource.data.indexOf(obj);
      this.lastUploadsSource.data.splice(indObj, 1);
      this.lastUploadsSource = new MatTableDataSource<Property[]>(this.lastUploadsSource.data);
      if (this.lastUploadsSource.data.length < 1) { this.isLastUploads = false; }

    });
  }

  ngOnDestroy() {
    if (this.mySubscribeOnStatus !== undefined) { this.mySubscribeOnStatus.unsubscribe(); }

    if (this.mySubscribeOnLastUploads !== undefined) { this.mySubscribeOnLastUploads.unsubscribe(); }

  }
}
