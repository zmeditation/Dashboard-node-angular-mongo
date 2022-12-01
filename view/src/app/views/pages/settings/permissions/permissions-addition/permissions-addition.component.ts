import { Component, OnDestroy, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { egretAnimations } from "shared/animations/egret-animations";
import { PermissionsHTTP } from '../http-permissions/http-permissions.servise';
import { FlashMessagesService } from "shared/services/flash-messages.service";
import { Subscription } from 'rxjs';
import { PermissionsControl } from '../permissionsControl/permissionsControl';
import { FormGroupDirective } from '@angular/forms';
import { Publishers, Roles, SuccessAnswer, UnsuccessAnswer } from '../interfaces';

@Component({
  selector: 'app-permissions-addition',
  templateUrl: './permissions-addition.component.html',
  styleUrls: ['./permissions-addition.component.scss'],
  animations: egretAnimations
})
export class PermissionsAdditionComponent extends PermissionsControl implements OnInit, OnDestroy {
  @Input() permissionsArray: string[];

  @Input() rolesArray: string[];

  @Input() publishersArray: Publishers[];

  @Input() roleList: Roles[];

  @Output() getPublishers = new EventEmitter();

  @Output() getPermissions = new EventEmitter();

  subscription = new Subscription();

  constructor(
    private httpServise: PermissionsHTTP,
    public flashMessage: FlashMessagesService
  ) {
    super(flashMessage);
  }

  ngOnInit(): void {
    this.initSubscriptions();
  }

  roleSelected(role: string): void {
    this.dataCleaner('permissions', 'publishers');

    this.publishersArray.forEach((obj: Publishers) => {
      if (obj.role === role) { this.publishersByRole.push(obj.name); }

    });

    this.roleList.forEach((obj: Roles) => {
      if (obj.name === role) {
        this.permissionsFiltred = this.permissionsArray.filter((el) => !obj.permissions.includes(el) && el);
        this.permissionsForm.get('permissions').setValidators(this.validatorExistPermissions(this.permissionsFiltred));
      }
    });

    this.formSetValue(['publishers', ''], ['permissions', '']);
  }

  publisherSelected(): void {
    const publisher = this.permissionsForm.get('publishers').value;

    // tslint:disable-next-line: no-unused-expression
    publisher !== '' && this.dataCleaner('permissions');

    this.selectedPublisherId = '';

    this.publishersArray.forEach((obj: Publishers) => {
      if (obj.name === publisher) {
        this.permissionsFiltred = this.permissionsArray.filter((el) => !obj.permissions.includes(el) && el);
        this.permissionsForm.get('permissions').setValidators(this.validatorExistPermissions(this.permissionsFiltred));
        this.selectedPublisherId = obj._id;
      }
    });

    // tslint:disable-next-line: no-unused-expression
    publisher !== '' && this.permissionsForm.get('permissions').reset();
  }

  permissionChecked(permission: string): void {
    if (this.selectedPermissions.includes(permission) === false) {
      this.selectedPermissions.push(permission);
    } else {
      this.selectedPermissions = this.selectedPermissions.filter((el) => el !== permission);
    }


    this.formSetValue(['permissions', this.selectedPermissions]);
  }

  optionClicked(event: Event, permission: string): void {
    event.stopPropagation();
    this.permissionChecked(permission);
  }

  async addPermission(formDirective: FormGroupDirective) {
    await this.updateQuery();

    const querySub = this.httpServise.queryPermission(this.query).subscribe(
      (data: SuccessAnswer) => {
        const { success, userEdited, editedPerm } = data;
        if (success === true) {
          this.flashMessagesByParams(userEdited, editedPerm, 'added');

          if (userEdited > 0) {
            this.getPublishers.emit();
            // tslint:disable-next-line: no-unused-expression
            this.query.typeOfAction === 'ADDING_FOR_ALL' && this.getPermissions.emit();

            this.dataCleaner('permissions', 'publishers', 'query');
            this.formSetValue(['publishers', ''], ['permissions', ''], ['roles', '']);
            formDirective.resetForm();
          }
        }
      },
      (err: UnsuccessAnswer) => {
        this.dataCleaner('permissions', 'publishers', 'query');
        this.formSetValue(['publishers', ''], ['permissions', ''], ['roles', '']);
        this.flashMessage.flash('error', err.error.msg, 5000);
        formDirective.resetForm();
      }
    );

    this.subscription.add(querySub);
  }

  async updateQuery() {
    if (this.selectedPublisherId === '') {
      this.query = {
        typeOfAction: 'ADDING_FOR_ALL',
        permissions: this.selectedPermissions,
        role: this.permissionsForm.get('roles').value
      };
    } else {
      this.query = {
        typeOfAction: 'ADDING_FOR_ONE',
        permissions: this.selectedPermissions,
        publisherId: this.selectedPublisherId
      };
    }


  }

  initSubscriptions() {
    const rolesChanged = this.permissionsForm.controls.roles.valueChanges.subscribe((value: string) => this.roleSelected(value));
    this.subscription.add(rolesChanged);

    const pubsChanged = this.permissionsForm.controls.publishers.valueChanges.subscribe(() => this.publisherSelected());
    this.subscription.add(pubsChanged);

    const permissionChanged = this.permissionsForm.controls.permissions.valueChanges.subscribe(() => {
      const arrayOfPermissionName = this.permissionsForm.get('permissions').value;

      if (typeof arrayOfPermissionName === 'string') {
        this.selectedPermissions = arrayOfPermissionName.split(',').filter((perm: string) => this.selectedPermissions.includes(perm));
      }


    });
    this.subscription.add(permissionChanged);
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) { this.subscription.unsubscribe(); }

  }
}
