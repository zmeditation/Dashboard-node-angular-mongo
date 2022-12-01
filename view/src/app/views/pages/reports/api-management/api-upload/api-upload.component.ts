import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { egretAnimations } from 'shared/animations/egret-animations';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { AppTranslationService } from 'shared/services/translation/translation.service';
import { ApiHttpService } from '../api-services/api-http.service';
import { ApiFormBuilder } from '../api-services/api-form-builder';
import { ApiUploadDialogComponent } from './api-upload-dialog/api-upload-dialog.component';

@Component({
  selector: 'app-api-upload',
  templateUrl: './api-upload.component.html',
  styleUrls: ['./api-upload.component.scss'],
  animations: egretAnimations
})
export class ApiUploadComponent extends ApiFormBuilder implements OnInit, OnDestroy {
  public selected: any = '';
  protected dialogRef;
  protected requestObject: any = {};

  constructor(
    public apiHttpService: ApiHttpService,
    public _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private flashMessage: FlashMessagesService,
    protected dateAdapter: DateAdapter<any>,
    protected appTranslation: AppTranslationService
  ) {
    super(apiHttpService, _formBuilder);

    this.handleDatepickerLang();
  }

  ngOnInit() {
    this.getProgrammaticsList();
    this.formBuilder();
  }

  protected handleDatepickerLang() {
    this.dateAdapter.setLocale(this.appTranslation.lang);

    this.SubscriptionsList.push(
      this.appTranslation.langSubject.subscribe((lang: string) => {
        this.dateAdapter.setLocale(lang);
      })
    );
  }

  uploadNewData(form) {
    this.requestObject = form;
    const dateFrom = form.dateFrom ? formatDate(form.dateFrom, 'yyyy-MM-dd', 'en-US') : '';
    const dateTo = form.dateTo ? formatDate(form.dateTo, 'yyyy-MM-dd', 'en-US') : dateFrom;
    this.requestObject = {
      programmatic: form.programmatic.programmatic,
      dateFrom,
      dateTo
    };

    this.openDialog();
    this.SubscriptionsList.push(
      this.apiHttpService.uploadNewDataOfProgrammatic(this.requestObject).subscribe(
        (resp) => {
          if (resp?.message === 'REPORT_UPLOADED') {
            this.flashMessage.flash('success', resp?.message, 3000);
            this.dialogRef.close();
            this.apiUploadForm.reset();
            return this.unavailabilityRange.max = new Date(new Date().setDate(new Date().getDate() - 1));
          }
          this.dialogRef.close();
          this.flashMessage.flash('error', resp?.message, 3000);
        },
        (err) => {
          const message = err.error.msg;
          this.dialogRef.close();
          this.apiUploadForm.reset();
          this.flashMessage.flash('error', message, 3000, 'top');
          this.unavailabilityRange.max = new Date(new Date().setDate(new Date().getDate() - 1));
        }
      )
    );
  }

  settingsForRequest() {
    this.changeRangeDate();

    if (this.selected.type === 'noDate') {
      this.apiUploadForm.get('dateFrom').disable();
      this.apiUploadForm.get('dateTo').disable();
    } else if (this.selected.type === 'date') {
      this.apiUploadForm.get('dateFrom').enable();
      this.apiUploadForm.get('dateTo').disable();
    } else if (this.selected.type === 'dateRange') {
      this.apiUploadForm.get('dateFrom').enable();
      this.apiUploadForm.get('dateTo').enable();
    }
  }

  openDialog() {
    this.dialogRef = this.dialog.open(ApiUploadDialogComponent, {
      width: '400px',
      data: { ...this.requestObject },
      disableClose: true
    });
  }

  // Set count of range calendar day from today to past by programmatic
  changeRangeDate() {
    if (this.apiUploadForm.get('programmatic').value.programmatic === 'RTBHouse') {
      this.unavailabilityRange.min = 40;
    } else {
      this.unavailabilityRange.min = Infinity;
    }

  }

  ngOnDestroy() {
    this.SubscriptionsList.forEach((sub) => sub.unsubscribe());
  }
}
