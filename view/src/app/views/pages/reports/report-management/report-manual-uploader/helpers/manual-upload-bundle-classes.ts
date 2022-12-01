import { ManualUploadForm } from "./manual-upload-form";
import { FormBuilder } from "@angular/forms";
import { ReportManualUploaderService } from "../../report-services/report-manual-uploader.service";
import { MatSnackBar } from "@angular/material/snack-bar";

export class ManualUploadBundleClasses extends ManualUploadForm {
  constructor(
    public _formBuilder: FormBuilder,
    public reportManualUploaderService: ReportManualUploaderService,
    public snackBar: MatSnackBar
  ) {
    super(_formBuilder, reportManualUploaderService);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      panelClass: ['mat-bg-warn']
    });
  }

  getErrorMessagePub() {
    return this.uploadFormManual.get('publisher').hasError('required')
      ? 'REQUIRED'
      : this.uploadFormManual.get('publisher').hasError('maxlength')
        ? 'MAXLENGTH'
        : this.uploadFormManual.get('publisher').hasError('')
          ? 'RANDOM'
          : 'RANDOM';
  }

  getErrorMessageDom() {
    return this.uploadFormManual.get('domain').hasError('required')
      ? 'REQUIRED'
      : this.uploadFormManual.get('domain').hasError('maxlength')
        ? 'MAXLENGTH'
        : 'RANDOM';
  }

  getErrorMessageDay() {
    return this.uploadFormManual.get('day').hasError('required')
      ? 'REQUIRED'
      : this.uploadFormManual.get('day').hasError('date')
        ? 'DATE'
        : '';
  }

  getErrorMessageType() {
    return this.uploadFormManual.get('inventory_type').hasError('required')
      ? 'REQUIRED'
      : this.uploadFormManual.get('inventory_type').hasError('')
        ? 'RANDOM'
        : 'RANDOM';
  }

  getErrorMessageTags() {
    return this.uploadFormManual.get('tags').hasError('required')
      ? 'REQUIRED'
      : this.uploadFormManual.get('tags').hasError('maxlength')
        ? 'MAXLENGTH'
        : 'RANDOM';
  }

  getErrorMessageOrigins() {
    return this.uploadFormManual.get('report_origin').hasError('required')
      ? 'REQUIRED'
      : this.uploadFormManual.get('report_origin').hasError('maxlength')
        ? 'MAXLENGTH'
        : this.uploadFormManual.get('matched_request').hasError('')
          ? 'RANDOM'
          : 'RANDOM';
  }
}
