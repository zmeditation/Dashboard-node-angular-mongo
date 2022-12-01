import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Property } from '../report-manual-uploader-table/report-manual-uploader-table.component';
import { Subscription } from 'rxjs/Subscription';
import { ReportManualUploaderService } from '../../report-services/report-manual-uploader.service';
import { formatDate } from '@angular/common';

export class ManualLastTableData {
  public lastUploadsSource = new MatTableDataSource([]);

  public isLastUploads = false;

  mySubscribeOnStatus: Subscription;

  constructor(public snackBar: MatSnackBar, public reportManualUploaderService: ReportManualUploaderService) {}

  getLastUploads() {
    this.mySubscribeOnStatus = this.reportManualUploaderService.getLastPostedPlacements().subscribe((placements: any) => {
      if (placements.reports === []) { return this.openSnackBar(`There wasn't uploads last time`, ''); }

      for (const d of placements.reports) { d.day = formatDate(d.day, 'yyyy-MM-dd', 'en-US'); }

      this.lastUploadsSource.disconnect();
      this.lastUploadsSource = new MatTableDataSource<Property[]>(placements.reports);

      this.lastUploadsSource.connect();
      if (placements.reports.length > 0) { this.isLastUploads = true; }

    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['mat-color-primary']
    });
  }
}
