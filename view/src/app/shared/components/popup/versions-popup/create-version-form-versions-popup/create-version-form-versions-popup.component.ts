import { Component, OnChanges, Output, EventEmitter } from '@angular/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VersionType } from 'shared/types/version';

const moment: any = _rollupMoment || _moment;

@Component({
  selector: 'app-create-version-form-versions-popup',
  templateUrl: './create-version-form-versions-popup.component.html',
  styleUrls: ['./create-version-form-versions-popup.component.scss']
})
export class CreateVersionFormVersionsPopupComponent implements OnChanges {
  @Output()
  public createVersion = new EventEmitter();

  @Output()
  public close = new EventEmitter();

  public isOutside = false;

  protected fields: string[] = ['version', 'releaseDate', 'insideDescription', 'outsideDescription'];

  public createVersionModel = new FormGroup({
    version: new FormControl('', [Validators.required, Validators.pattern(/^[0-9\.A-z]+$/)]),
    releaseDate: new FormControl(moment(), [Validators.required]),
    isOutside: new FormControl(false),
    insideDescription: new FormControl('', [Validators.required]),
    outsideDescription: new FormControl('')
  });

  ngOnChanges() {
    this.clearFormAfterCreate();
  }

  public clearFormAfterCreate(): void {
    for (const field of this.fields) {
      if (field === 'releaseDate') {
        this.createVersionModel.get(field).setValue(moment());
      } else {
        this.createVersionModel.get(field).setValue('');
        this.createVersionModel.get(field).setErrors(null);
      }
    }
  }

  public createEvent(): void {
    if (!this.isErrorsCreateVersion()) {
      let out = this.createVersionModel.get('outsideDescription').value.trim();
      out = out ? out : null;

      this.createVersion.emit({
        version: this.createVersionModel.get('version').value.trim(),
        releaseDate: this.createVersionModel.get('releaseDate').value.toDate(),
        description: {
          in: this.createVersionModel.get('insideDescription').value.trim(),
          out
        }
      });
    }
  }

  protected isErrorsCreateVersion(): boolean {
    for (const field of this.fields) {
      if (this.createVersionModel.get(field).errors) {
        return true;
      }
    }
    return false;
  }

  protected getCreateVersionData(): VersionType {
    const result: any = {};

    for (const field of this.fields) {
      if (field === 'releaseDate') {
        result[field] = this.createVersionModel.get(field).value.toDate();
      } else {
        result[field] = this.createVersionModel.get(field).value.trim();
      }
    }

    return result;
  }

  public closeEvent(): void {
    this.close.emit();
  }
}
