import { Component, AfterViewInit, OnChanges, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { VersionType, UpdateVersionType, DescriptionType } from 'shared/types/version';
import { ValueObject } from 'shared/types/object';
import { CreateVersionFormVersionsPopupComponent } from './create-version-form-versions-popup/create-version-form-versions-popup.component';

@Component({
  selector: 'app-versions-popup',
  templateUrl: './versions-popup.component.html',
  styleUrls: ['./versions-popup.component.scss']
})
export class VersionsPopupComponent implements AfterViewInit, OnChanges {
  @Input()
  public versions: Array<any>;

  @Input()
  public currentVersionReleaseDate: Date;

  @Input()
  public currentVersionDescription: string | DescriptionType;

  @Input()
  public isClearCreateForm: boolean;

  @Input()
  public isLoading: boolean;

  @Output()
  public close = new EventEmitter();

  @Output()
  public changeVersion = new EventEmitter();

  @Output()
  public createVersion = new EventEmitter();

  @Output()
  public updateVersion = new EventEmitter();

  @Output()
  public deleteVersion = new EventEmitter();

  @ViewChild(CreateVersionFormVersionsPopupComponent)
  protected createVersionForm: CreateVersionFormVersionsPopupComponent;

  public selected = '';

  public canEdit = false;

  public isOutside = false;

  public constructor(
    private userPermissions: NgxPermissionsService
  ) {
    this.canEdit = !!this.userPermissions.getPermission('canEditVersion');
  }

  ngAfterViewInit() {
    // Fix angular error
    setTimeout(() => {
      if (this.versions.length) {
        this.selected = this.versions[0].value;
        this.changeVersionEvent();
      }
    }, 0);
  }

  ngOnChanges() {
    if (this.isClearCreateForm) {
      this.createVersionForm.clearFormAfterCreate();
    }
  }

  public changeVersionEvent(): void {
    this.changeVersion.emit({
      value: this.selected
    });
  }

  public createVersionEvent(event: VersionType) {
    this.createVersion.emit(event);
  }

  public updateVersionEvent(event: UpdateVersionType) {
    this.updateVersion.emit(event);
  }

  public deleteVersionEvent(event: ValueObject): void {
    this.deleteVersion.emit(event);
  }

  public closeEvent(): void {
    this.close.emit();
  }

  public setSelectedVersion(value: string): void {
    this.selected = value;
  }
}
