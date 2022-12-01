import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PermissionsHTTP } from '../http-permissions/http-permissions.servise';
import { Subscription } from 'rxjs';
import { AddRole } from '../interfaces';

@Component({
  selector: 'app-permissions-roles',
  templateUrl: './permissions-roles.component.html',
  styleUrls: ['./permissions-roles.component.scss']
})
export class PermissionsRolesComponent implements OnInit, OnDestroy {
  @Input() arrayofRolesToSend: string[] = [];

  @Input() objectReadyToAdd: AddRole;

  @Input() roleRows: any[];

  @Input() arrayOftypesOfPermissionSet: Set<string> = new Set();

  @Input() arrayOFobjectPermissions: any[] = [];

  @Output() getPermissions = new EventEmitter();

  @Output() manageArrays = new EventEmitter();

  managingRoles: FormGroup;

  roleName: string;

  showManageRoles = false;

  outlined = [[], []];

  arrayOfPermissionsReadyToAdd: string[] = [];

  subAddRole: Subscription;

  subRemoveRole: Subscription;

  constructor(
    public httpServise: PermissionsHTTP
  ) {}

  ngOnInit() {
    this.managingRoles = new FormGroup({
      name: new FormControl(this.roleName, [Validators.required, Validators.minLength(4)])
    });
  }

  manageRoles() {
    this.showManageRoles = !this.showManageRoles;
    this.manageArrays.emit();
  }

  addRole(z, i, res) {
    this.outlined[z][i] = !this.outlined[z][i];

    if (this.outlined[z][i] === true) {
      this.arrayOfPermissionsReadyToAdd.push(res);
    } else {
      const index = this.arrayOfPermissionsReadyToAdd.indexOf(res);
      this.arrayOfPermissionsReadyToAdd.splice(index, 1);
    }
  }

  sendRolesToServer() {
    this.objectReadyToAdd.name = this.roleName.toUpperCase().trim();
    this.objectReadyToAdd.permissions = this.arrayOfPermissionsReadyToAdd;

    this.subAddRole = this.httpServise.queryAddRole(this.objectReadyToAdd).subscribe((data) => {
      this.managingRoles.reset();
      this.getPermissions.emit();
    });
  }

  deleteRole(id) {
    this.subRemoveRole = this.httpServise.queryRemoveRole(id).subscribe((data) => {
      this.getPermissions.emit();
    });
  }

  ngOnDestroy(): void {
    if (this.subAddRole !== undefined) { this.subAddRole.unsubscribe(); } 

    if (this.subRemoveRole !== undefined) { this.subRemoveRole.unsubscribe(); } 

  }
}
