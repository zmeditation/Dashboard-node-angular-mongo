import { Component } from '@angular/core';
import { egretAnimations } from 'shared/animations/egret-animations';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../../../environments/environment';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { XLSX, CSV, XLS } from 'shared/constants/mime-types';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FileItem } from "ng2-file-upload/file-upload/file-item.class";
import { MatSelectChange } from "@angular/material/select";

export type Programmatic = {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-report-file-uploader',
  templateUrl: './report-file-uploader.component.html',
  styleUrls: ['./report-file-uploader.component.scss'],
  animations: egretAnimations
})
export class ReportFileUploaderComponent {

  programmatics: Programmatic[] = [
    { value: 'Amazon', viewValue: 'Amazon' },
    { value: 'AppNexus_CSV', viewValue: 'AppNexus' },
    { value: 'bRealTime', viewValue: 'bRealTime' },
    { value: 'Google Ad Manager', viewValue: 'Google Ad Manager' },
    { value: 'Google Ad Manager HB', viewValue: 'Google Ad Manager HB' },
    { value: 'Rubicon', viewValue: 'Rubicon' },
    { value: 'Smart', viewValue: 'Smar+' },
    { value: 'Yandex', viewValue: 'Yandex' },
    { value: 'RTB House', viewValue: 'RTB House' },
    { value: 'EMX', viewValue: 'EMX' },
    { value: 'Adagio', viewValue: 'Adagio' },
    { value: 'EPlanning', viewValue: 'E-Planning' },
    { value: 'OpenX', viewValue: 'OpenX' },
    { value: 'OneTag', viewValue: 'OneTag' },
    { value: 'Criteo', viewValue: 'Criteo' }
  ].sort((a, b) => {
    if (a.value > b.value) {
      return 1;
    } else {
      return -1;
    }
  })

  public programmaticForm: FormGroup = new FormGroup({
    programmaticValue: new FormControl('', [Validators.required])
  })

  public uploader: FileUploader = new FileUploader({
    url: environment.apiURL + '/reports/upload/file',
    allowedMimeType: [XLS, CSV, XLSX],
    authTokenHeader: 'Authorization',
    authToken: localStorage.getItem('currentUser')
  });

  public hasBaseDropZoneOver = false;

  constructor(
    private flashMessage: FlashMessagesService,
    private translate: TranslateService
  ) {
    this.uploader.onWhenAddingFileFailed = () => this.onWhenAddingFileFailed();
    this.uploader.onErrorItem = (item: FileItem, response: string): void => this.onErrorItem(item, response);
    this.uploader.onBuildItemForm = (fileItem: FileItem, form: FormData) => this.onBuildItemForm(fileItem, form);
    this.uploader.onBeforeUploadItem = (item: FileItem) => this.onBeforeUploadItem(item);
  }

  selected(event: MatSelectChange, item: FileItem): void {
    if (item.isSuccess === true) {
      return;
    } else if (item.isError === true) {
      item.isReady = true;
      item.isUploaded = false;
      item.isError = false;
    }
    item.alias = event.value;
  }

  onWhenAddingFileFailed(): void {
    this.flashMessage.flash('error',
      this.translate.instant('REPORT_MANAGEMENT_PAGE.FILE_UPLOADER.INCORRECT_FILE_TYPE'),
      3000)
  }

  onErrorItem(item: FileItem, response: string): void {
    let msg;
    try {
      msg = JSON.parse(response).msg;
      if (msg.includes('Cannot read property')) {
        msg = 'EMPTY_FILE';
      }
    } catch (e) {
      if (item.alias && item.alias === 'file') {
        msg = 'NO_PROGRAMMATIC';
      }
    }

    const message = msg ? msg : 'GENERAL_ERROR';
    this.flashMessage.flash('error', this.translate.instant('REPORT_MANAGEMENT_PAGE.FILE_UPLOADER.' + message), 3000);
  }

  onBuildItemForm(fileItem: FileItem, form: FormData) {
    const { alias: selectedProgrammatic } = fileItem;
    fileItem.alias = 'file';
    form.append('origin', selectedProgrammatic);
    return { fileItem, form }
  }

  onBeforeUploadItem = (item: FileItem) => {
    if (item.alias === 'file') {
      throw new Error();
    }
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
}
