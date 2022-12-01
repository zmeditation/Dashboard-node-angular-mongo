import { Component, OnDestroy, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { PermissionsHTTP } from '../http-permissions/http-permissions.servise';
import { FlashMessagesService } from "shared/services/flash-messages.service";
import { Subscription } from 'rxjs';
import { AppConfirmService } from "shared/services/app-confirm/app-confirm.service";
import { PermissionsControl } from '../permissionsControl/permissionsControl';
import { Publishers, Roles, SuccessAnswer, UnsuccessAnswer } from '../interfaces';

@Component({
  selector: 'app-permissions-deletion',
  templateUrl: './permissions-deletion.component.html',
  styleUrls: ['./permissions-deletion.component.scss']
})
export class PermissionsDeletionComponent extends PermissionsControl implements OnInit, OnDestroy {
  @Input() permissionsArray: string[];

  @Input() rolesArray: string[];

  @Input() publishersArray: Publishers[];

  @Input() roleList: Roles[];

  @Output() getPublishers = new EventEmitter();

  @Output() getPermissions = new EventEmitter();

  private subscription: Subscription = new Subscription();

  constructor(
    private httpServise: PermissionsHTTP,
    public confirmService: AppConfirmService,
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
        this.permissionsFiltred = [...obj.permissions];
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
        this.permissionsFiltred = this.permissionsArray.filter((el: string) => obj.permissions.includes(el) && el);
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
      this.selectedPermissions = this.selectedPermissions.filter((el: string) => el !== permission);
    }


    this.formSetValue(['permissions', this.selectedPermissions]);
  }

  optionClicked(event: Event, permission: string): void {
    event.stopPropagation();
    this.permissionChecked(permission);
  }

  delPermission(formDirective: FormGroupDirective): void {
    this.updateQuery();
    const confirm = {
      title: this.selectedPermissions.length > 1 ? 'Delete permissions ?' : 'Delete permission ?',
      message: `${ this.selectedPermissions.join(', ') }.`
    };

    const confirmSub = this.confirmService.confirm(confirm).subscribe((answer) => {
      if (!answer) { return; }


      const querySub = this.httpServise.queryPermission(this.query).subscribe(
        (data: SuccessAnswer) => {
          const { success, userEdited, editedPerm } = data;
          if (success === true) {
            this.flashMessagesByParams(userEdited, editedPerm, 'deleted');

            if (userEdited > 0) {
              this.getPublishers.emit();
              // tslint:disable-next-line: no-unused-expression
              this.query.typeOfAction === 'DELETION_FOR_ALL' && this.getPermissions.emit();

              this.dataCleaner('permissions', 'publishers', 'query');
              this.formSetValue(['publishers', ''], ['permissions', ''], ['roles', '']);
              formDirective.resetForm();
            }
          }
        },
        (err: UnsuccessAnswer) => {
          this.dataCleaner('permissions', 'publishers', 'query');
          this.formSetValue(['publishers', ''], ['permissions', ''], ['roles', '']);
          formDirective.resetForm();
          this.flashMessage.flash('error', err.error.msg, 5000);
        }
      );
      this.subscription.add(querySub);
    });
    this.subscription.add(confirmSub);
  }

  updateQuery(): void {
    if (this.selectedPublisherId === '') {
      this.query = {
        typeOfAction: 'DELETION_FOR_ALL',
        permissions: this.selectedPermissions,
        role: this.permissionsForm.get('roles').value
      };
    } else {
      this.query = {
        typeOfAction: 'DELETION_FOR_ONE',
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
