import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FlashMessagesService } from 'shared/services/flash-messages.service';

export class PermissionsControl {
  publishersFilter: Observable<any>;

  permissionsFilter: Observable<any>;

  selectedPermissions: Array<string> = [];

  publishersByRole: Array<any> = [];

  permissionsFiltred: Array<any> = [];

  query: any = {};

  selectedPublisherId = '';

  permissionsForm: FormGroup;

  constructor(public flashMessage: FlashMessagesService) {
    this.permissionsForm = new FormGroup({
      roles: new FormControl('', Validators.required),
      publishers: new FormControl(''),
      permissions: new FormControl([], Validators.required)
    });

    this.publishersFilter = this.permissionsForm.get('publishers').valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : '')),
      map((filter) => this._filterPublishers(filter))
    );

    this.permissionsFilter = this.permissionsForm.get('permissions').valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : '')),
      map((filter) => this._filterPermissions(filter))
    );
  }

  public _filterPublishers(value: string): any {
    return this.publishersByRole.filter((option) => option.toLowerCase().includes(value.toLowerCase()));
  }

  public _filterPermissions(value: string): any {
    return this.permissionsFiltred.filter((option) => option.toLowerCase().includes(value.toLowerCase()));
  }

  formSetValue(...args: any) {
    const formInputs = {
      permissions: (val: any) => {
        this.permissionsForm.get('permissions').setValue(val);
      },

      publishers: (val: any) => {
        this.permissionsForm.get('publishers').setValue(val);
      },

      roles: (val: any) => {
        this.permissionsForm.get('roles').setValue(val);
      }
    };

    args.forEach((arr) => formInputs[arr[0]](arr[1]));
  }

  dataCleaner(...args) {
    const objOfCLeaners = {
      permissions: () => {
        this.permissionsFiltred = [];
        this.selectedPermissions = [];
      },

      publishers: () => {
        this.publishersByRole = [];
        this.selectedPublisherId = '';
      },

      query: () => {
        this.query = {};
      }
    };

    args.forEach((funcStr) => objOfCLeaners[funcStr]());
  }

  validatorExistPermissions(list: string[]): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const check = Array.isArray(list) && group.value ? this.checkValidInputData(list, group.value) : false;

      if (check === false) { return { notExistPermissions: true }; }


      return null;
    };
  }

  checkValidInputData(permissionArray: string[], formInputvalue: string[] | string): boolean {
    const isArray = formInputvalue as Array<string>;
    const isString = formInputvalue as string;

    if (Array.isArray(isArray) === true) {
      return permissionArray.some((perm) => isArray.includes(perm)) && this.selectedPermissions.length > 0;
    }


    if (typeof isString === 'string') {
      const arrayfromString = isString.split(',');
      return arrayfromString.every((perm) => permissionArray.includes(perm)) && this.selectedPermissions.length > 0;
    }
  }

  public flashMessagesByParams(userEdited: number, editedPerm: number, event: string): void {
    const showMsgTime = 3000;
    const waitNextFlashMsg = 3000;

    this.flashMessage.flash('success', `Successfully ${ event } permissions from ${ userEdited } users`, showMsgTime);

    if (editedPerm) {
      setTimeout(() => {
        this.flashMessage.flash('success', `Successfully ${ event } ${ editedPerm } permissions`, showMsgTime);
      }, waitNextFlashMsg);
    }


  }
}
