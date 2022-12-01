import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterViewChecked } from '@angular/core';
import { PermissionsHTTP } from '../http-permissions/http-permissions.servise';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AppConfirmService } from "shared/services/app-confirm/app-confirm.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-permissions-list',
  templateUrl: './permissions-list.component.html',
  styleUrls: ['./permissions-list.component.scss']
})
export class PermissionsListComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() permissions: any[];

  @Input() roleList: any[];

  @Input() arrayofRolesToSend: string[] = [];

  @Input() rows: any[];

  @Input() types: string[];

  @Output() getPermissions = new EventEmitter();

  @Output() manageArrays = new EventEmitter();

  subAddOne: Subscription;

  subRemoveOne: Subscription;

  subConfirm: Subscription;

  managingPermisions: FormGroup;

  permissionName: string;

  description: string;

  showManagePermissions = false;

  sendPermissionToServer: any = {};

  constructor(
    private httpServise: PermissionsHTTP,
    private confirmService: AppConfirmService
  ) {}

  ngOnInit() {
    this.managingPermisions = new FormGroup({
      name: new FormControl(this.permissionName, [Validators.required, Validators.minLength(4), this.validatorForPermission(this.rows)]),

      description: new FormControl(this.description, [Validators.required, Validators.minLength(4), Validators.maxLength(35)]),

      types: new FormControl('', [Validators.required]),

      roleName: new FormControl('')
    });
  }

  ngAfterViewChecked() {
    this.managingPermisions.get('types').setValidators(this.validatorForTypes(this.types));
  }

  managePermissions() {
    this.showManagePermissions = !this.showManagePermissions;
    this.manageArrays.emit();
  }

  validatorForPermission(list): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      let check = true;
      list.forEach((el) => {
        if (el.name === group.value) { check = false; }

      });
      if (check) { return null; } else {
        return {
          unique: true
        }; 
      }


    };
  }

  validatorForTypes(list): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const check = list.some((el) => el === group.value);

      if (check === false) { return { notAllowedType: true }; }


      return null;
    };
  }

  sendPermissionsToServer() {
    this.sendPermissionToServer.permission = this.permissionName;
    this.sendPermissionToServer.description = {
      name: this.permissionName,
      description: this.description,
      type: this.managingPermisions.controls.types.value
    };
    this.sendPermissionToServer.roles = this.arrayofRolesToSend;

    this.subAddOne = this.httpServise.queryAddOne(this.sendPermissionToServer).subscribe((data) => {
      this.managingPermisions.reset();
      this.getPermissions.emit();
      this.arrayofRolesToSend = [];
    });
  }

  deletePermission(permission) {
    this.subConfirm = this.confirmService.confirm({ message: `Delete ${ permission } ?` }).subscribe((answer) => {
      if (!answer) { return; }


      this.subRemoveOne = this.httpServise.queryRemoveOne(permission).subscribe((data) => {
        this.managingPermisions.reset();
        this.getPermissions.emit();
      });
    });
  }

  addRoleToSend(roleName, index, checkbox) {
    if (checkbox.checked === false) {
      this.arrayofRolesToSend.push(roleName);
    } else {
      const inx = this.arrayofRolesToSend.indexOf(roleName);
      this.arrayofRolesToSend.splice(inx, 1);
    }
  }

  ngOnDestroy(): void {
    if (this.subAddOne !== undefined) { this.subAddOne.unsubscribe(); }

    if (this.subRemoveOne !== undefined) { this.subRemoveOne.unsubscribe(); }

    if (this.subConfirm !== undefined) { this.subConfirm.unsubscribe(); }

  }
}
