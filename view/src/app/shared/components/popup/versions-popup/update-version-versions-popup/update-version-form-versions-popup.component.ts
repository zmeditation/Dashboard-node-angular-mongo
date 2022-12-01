import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateVersionType, DescriptionType } from 'shared/types/version';

const moment: any = _rollupMoment || _moment;

@Component({
  selector: 'app-update-version-form-versions-popup',
  templateUrl: './update-version-form-versions-popup.component.html',
  styleUrls: ['./update-version-form-versions-popup.component.scss']
})
export class UpdateVersionFormVersionsPopupComponent implements OnChanges {
  @Input()
  public version: string;

  @Input()
  public releaseDate: Date;

  @Input()
  public description: DescriptionType;

  @Output()
  public updateVersion = new EventEmitter();

  @Output()
  public deleteVersion = new EventEmitter();

  @Output()
  public close = new EventEmitter();

  protected fields: string[] = ['version', 'releaseDate', 'insideDescription', 'outsideDescription'];

  public updateVersionModel = new FormGroup({
    version: new FormControl('', [Validators.required, Validators.pattern(/^[0-9\.A-z]+$/)]),
    releaseDate: new FormControl(moment(), [Validators.required]),
    isOutside: new FormControl(false),
    insideDescription: new FormControl('', [Validators.required]),
    outsideDescription: new FormControl('')
  });

  ngOnChanges() {
    this.setVersionIfChanges();
    this.setReleaseDateIfChanges();
    this.setDescriptionIfChanges();
  }

  protected setVersionIfChanges(): void {
    this.updateVersionModel.get('version').setValue(this.version);
  }

  protected setReleaseDateIfChanges(): void {
    this.updateVersionModel
      .get('releaseDate')
      .setValue(moment([this.releaseDate.getFullYear(), this.releaseDate.getMonth(), this.releaseDate.getDate()]));
  }

  protected setDescriptionIfChanges(): void {
    this.updateVersionModel.get('insideDescription').setValue(this.description.in);
    this.updateVersionModel.get('outsideDescription').setValue(this.description.out);
  }

  public updateEvent(): void {
    if (!this.isErrorsUpdateVersion()) {
      const data: UpdateVersionType = {
        lastVersion: this.version,
        newVersion: this.updateVersionModel.get('version').value,
        releaseDate: this.updateVersionModel.get('releaseDate').value.toDate().toString(),
        description: {
          in: this.updateVersionModel.get('insideDescription').value.trim(),
          out: this.updateVersionModel.get('outsideDescription').value.trim()
        }
      };

      this.updateVersion.emit(data);
    }
  }

  public deleteEvent(): void {
    if (this.version) {
      this.deleteVersion.emit({
        value: this.version
      });
    }
  }

  public closeEvent() {
    this.close.emit();
  }

  protected isErrorsUpdateVersion(): boolean {
    for (const field of this.fields) {
      if (field !== 'selectedVersion' && this.updateVersionModel.get(field).errors) {
        return true;
      }
    }
    return false;
  }
}
