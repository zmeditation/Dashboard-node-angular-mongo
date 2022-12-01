/** @format */

//  Компонент для добавления нового пользователя или редактирования старого. Отпрвляет данные на сервер.
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter } from '@angular/material/core';
import { CustomValidators } from 'ngx-custom-validators';
import { NgxPermissionsService } from 'ngx-permissions';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UsersEndpointsService } from 'shared/services/cruds/users-endpoints.service';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { egretAnimations } from 'shared/animations/egret-animations';
import { EventCollectorService } from 'shared/services/event-collector/event-collector.service';
import { AppTranslationService } from 'shared/services/translation/translation.service';
import { DataTransitionService } from '../_services-and-helpers/data-transition.service';
import { Helpers } from '../_services-and-helpers/helpers';
import { UsersComponent } from '../users.component';
import { User } from 'shared/interfaces/users.interface';
import { ROLES } from 'shared/interfaces/roles.interface';

export type IncomingData = { allUsers: User[]; payload: User; title: string; edit: boolean; addinfo: any };

@Component({
  selector: 'app-user-pop-up',
  templateUrl: './user-pop-up.component.html',
  styleUrls: ['./user-pop-up.component.scss'],
  animations: egretAnimations
})

// в хелперах функции содержания стейта редактирования и отправки дополнительной информации с других компонентов.
export class UserPopUpComponent extends Helpers implements OnInit, OnDestroy {
  public mainForm: FormGroup;

  public roles: string[];

  public potentialForWbid = false;

  public isRTBFormEnabled = false;

  public permissions: Array<string>;

  public disabledPasswords = false;

  public objectReadyToSend = { userObject: {} };

  public message = 'error';

  public showPassword = true;

  public passwordPlaceholder = '';

  public editablePassword = false;

  public showForm = false;

  public owner = {
    id: null,
    show: true,
    name: '',
    date_to_connect_am: ''
  };

  public user: User | any = {};

  public isDiscardPopup = false;

  public confirmPopupTitle: string;

  public confirmPopupMessage: string;

  subscriptions: Subscription = new Subscription();

  public showEditAccountManager = false;
  
  public showEditRole = false;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: IncomingData,
    public dialogRef: MatDialogRef<UsersComponent>,
    protected formBuilder: FormBuilder,
    protected usersEndpoints: UsersEndpointsService,
    protected transitService: DataTransitionService,
    protected flashMessage: FlashMessagesService,
    protected router: Router,
    protected eventCollectorService: EventCollectorService,
    protected snack: MatSnackBar,
    protected dateAdapter: DateAdapter<any>,
    protected translate: TranslateService,
    protected appTranslation: AppTranslationService,
    protected permissionsService: NgxPermissionsService
  ) {
    super(transitService);
  }

  ngOnInit() {
    if (this.data.edit) {
      this.loadOldUser();
    } else {
      this.loadNewUser();
    }

    this.confirmPopupTitle = this.translate.instant('USERS_PAGE.USERS_POPUP_COMPONENT.CONFIRM');
    this.confirmPopupMessage = this.translate.instant('USERS_PAGE.USERS_POPUP_COMPONENT.DISCARD_CHANGES');

    this.subscriptions.add(
      this.transitService.getMessage().subscribe((data) => {
        if (data) {
          this.data.addinfo = data;
          this.invalid = this.mainForm ? this.mainForm.invalid : true;
          this.saveButtonDisabled = data.waschanged ? this.invalid : !data.waschanged && this.invalid;
        }
      })
    );
    this.sendEditable(false);
    this.handleDatepickerLang();
  }

  protected handleDatepickerLang() {
    this.dateAdapter.setLocale(this.appTranslation.lang);
    this.subscriptions.add(
      this.appTranslation.langSubject.subscribe((lang: string) => {
        this.dateAdapter.setLocale(lang);
      })
    );
  }

  get currentUser() {
    let result: User;
    this.subscriptions.add(
      this.eventCollectorService.managedUserInfo$.subscribe((u: User) => {
        result = u;
      })
    );
    return result;
  }

  loadOldUser() {
    // Загружает существующего юзера
    this.subscriptions.add(
      this.usersEndpoints.getUser(this.data.payload._id).subscribe((data: { user: User }) => {
        this.user = data.user;
        this.loadUser();
        this.user.role === ROLES.PUBLISHER ? (this.potentialForWbid = true) : (this.potentialForWbid = false);
        this.user.role === ROLES.PARTNER ? (this.isRTBFormEnabled = true) : (this.isRTBFormEnabled = false);
      })
    );
  }

  loadNewUser() {
    // Загружает нового пользователя
    this.loadUser();
  }

  loadUser() {
    // Функция для загрузки пользователя
    this.getOwner(this.data, this.user);
    this.buildItemForm(this.data, this.user);
    this.subscriptions.add(
      this.mainForm.valueChanges.subscribe(() => {
        this.sendEditable(this.mainForm.dirty);
      })
    );
    this.showForm = true;
    this.subscriptions.add(
      this.mainForm.statusChanges.subscribe((status) => {
        status === 'INVALID' ? this.sendEditable(true) : this.sendEditable(false);
      })
    );
  }

  getOwner(d: IncomingData, user?) {
    // Отдает пользователя который владеет пользователем в попапе.
    // PS  - функцию стоит переделать.

    if (d.edit) {
      if (user) {
        const data = user;
        if (!data.am && !data.sam) {
          this.owner.show = false;
          this.owner.name = '';
        } else if (data.am !== null) {
          this.owner.show = true;
          this.owner.id = data.am._id;
          this.owner.name = data.am.name;
          this.owner.date_to_connect_am = data.date_to_connect_am ? data.date_to_connect_am.replace(/T.*/, '') : null;
        } else if (data.sam !== null) {
          this.owner.show = true;
          this.owner.name = data.sam.name;
          this.owner.date_to_connect_am = data.date_to_connect_am ? data.date_to_connect_am.replace(/T.*/, '') : null;
        }
      }
    } else {
      this.owner.show = false;
    }

    this.setShowEditAccountManager();
    this.setShowEditRole();

    if (this.showEditRole) {
      this.getRole();
    }
  }

  private setShowEditAccountManager(): void {
    const isPub = this.data.payload.role === 'PUBLISHER';
    this.showEditAccountManager =
      (isPub && !!this.permissionsService.getPermission('canEditAllPubs')) ||
      (isPub && !!this.permissionsService.getPermission('canEditAllUsers'));
  }

  private setShowEditRole(): void {
    const permissions = this.permissionsService.getPermissions();

    const operationPermissions = this.data.edit
      ? ['canEditAllUsers', 'canEditAllPubs', 'canEditOwnPubs']
      : ['canAddAllUsers', 'canAddOwnAccountManagers', 'canAddOwnPubs'];

    this.showEditRole = operationPermissions.some(perm => !!permissions[perm]);
  }

  getRole() {
    // выдает список ролей для выбора.
    this.subscriptions.add(
      this.usersEndpoints.getRoles().subscribe((data) => {
        this.roles = data.roles;
      })
    );
  }

  buildItemForm(data, user?) {
    if (data.edit) {
      this.passwordPlaceholder = 'placeholder';
    }
    const password = new FormControl(this.passwordPlaceholder || '', [Validators.required, this.validatorForUserPassword()]);
    const certainPassword = new FormControl(this.passwordPlaceholder || '', CustomValidators.equalTo(password));
    this.mainForm = this.formBuilder.group({
      name: [user.name || '', [Validators.required, this.validatorForUserName()]],
      role: [user.role || '', Validators.required],
      email: [user.email || '', [
        Validators.email, 
        Validators.required, 
        Validators.maxLength(50), 
        Validators.minLength(6),
        // Email validation pattern
        Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ]],
      password: password,
      password_confirm: certainPassword,
      enabled: this.formBuilder.group({
        changed: [user.enabled ? user.enabled.changed : false],
        status: [user.enabled ? user.enabled.status : false]
      }),
      am: [user.am || null],
      sam: [user.sam || null],
      // domains: [{ include: [], exclude: [], usersDomains: user.domains } || { exclude: [], include: [], usersDomains: [] }],
      permissions: [user.permissions || ''],
      connected_users: [user.connected_users || ''],
      cwe: [user.cwe || null],
      wbidType: [user.wbidType || []],
      wbidUserId: [user.wbidUserId || null],
      oRTBType: [user.oRTBType || null],
      oRTBId: [user.oRTBId || null, [Validators.pattern(/^\d*\.?\d*$/)]],
      adWMGAdapter: [user.adWMGAdapter || null],
      additional: this.formBuilder.group({
        company: [user.additional ? (user.additional.company ? user.additional.company : '') : '', [this.validatorForCompany()]],
        phone: [user.additional ? (user.additional.phone ? user.additional.phone : '') : '', [this.validatorForPhone()]],
        skype: [user.additional ? (user.additional.skype ? user.additional.skype : '') : '', [Validators.maxLength(30)]],
        address: [user.additional ? (user.additional.address ? user.additional.address : '') : '', [Validators.maxLength(160)]],
        birthday: [user.additional ? (user.additional.birthday ? user.additional.birthday : '') : '', [this.validatorForBirthday()]],
        description: [user.additional ? (user.additional.description ? user.additional.description : '') : '', [Validators.maxLength(255)]]
      }),
      isTest: !!user.is_test
      // тимчасовий чек. Потрірбно буде переробити його
    });
    // this.mainForm.controls['password'].enable();
    // this.mainForm.controls['password_confirm'].enable();
    if (data.edit) {
      this.editablePassword = true;
      this.disabledPasswords = true;
      this.permissions = user.permissions;
      this.mainForm.controls.password.disable();
      this.mainForm.controls.password_confirm.disable();
    }
  }

  editPassword() {
    this.mainForm.controls.password.enable();
    this.mainForm.controls.password_confirm.enable();
    this.sendEditable(true);
  }

  savePassword() {
    if (this.mainForm.valid === true) {
      this.showPassword = true;
    }
    this.sendEditable(false);
  }

  cancelPassword() {
    this.showPassword = true;
    this.mainForm.value.password = 'placeholder';
    this.mainForm.value.password_confirm = 'placeholder';
  }

  toProperties() {
    this.transitService.sendRouteMessage(this.data.payload);
    if (this.prepareObjectToSend()) {
      this.message = 'Save before go to properties';
      this.flashMessage.flash('error', this.message, 3000, 'bottom');
    } else {
      this.objectPreparation();
      this.dialogRef.close(false);
      this.router.navigate(['/users', 'properties', this.data.payload._id]);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.transitService.sendRouteMessage({ object: this.objectReadyToSend, id: this.data.payload._id });
  }

  objectPreparation() {
    if (this.mainForm.value.role === 'PUBLISHER' && this.data.edit === false) {
      this.mainForm.value.commission = { commission_number: 30, commission_type: 'eCPM' };
    } else {
      this.mainForm.value.commission = this.user.commission;
    }
    this.objectReadyToSend.userObject = this.mainForm.value;
    // @ts-ignore
    this.objectReadyToSend.userObject.properties = this.data.payload.properties === null ? [] : this.data.payload.properties;
    // @ts-ignore
    this.objectReadyToSend.userObject.addinfo = this.data.addinfo;
    if (this.mainForm.value.password === 'placeholder' || this.mainForm.value.password === undefined) {
      delete this.mainForm.value.password;
      delete this.mainForm.value.password_confirm;
    } else {
      // @ts-ignore
      this.objectReadyToSend.userObject.password = this.mainForm.value.password;
      // @ts-ignore
      this.objectReadyToSend.userObject.password_confirm = this.mainForm.value.password_confirm;
    }
    // @ts-ignore
    if (this.objectReadyToSend.userObject.am) {
      // @ts-ignore
      this.objectReadyToSend.userObject.am = this.mainForm.value.am._id;
    }
    // @ts-ignore
    if (this.objectReadyToSend.userObject.sam) {
      // @ts-ignore
      this.objectReadyToSend.userObject.sam = this.mainForm.value.sam._id;
    }
    // @ts-ignore
    if (this.objectReadyToSend.userObject.connected_users.p) {
      // @ts-ignore
      this.objectReadyToSend.userObject.connected_users.p = this.mainForm.value.connected_users.p.map((user) => user._id);
    }
    // @ts-ignore
    if (this.objectReadyToSend.userObject.connected_users.am) {
      // @ts-ignore
      this.objectReadyToSend.userObject.connected_users.am = this.mainForm.value.connected_users.am.map((user) => user._id);
    }

    // @ts-ignore
    this.objectReadyToSend.userObject.id = this.user._id

    if (
      // проверяет дополнительную информацию и если есть отправляет.
      // this.data.addinfo.domains ||
      this.data.addinfo.commission ||
      this.data.addinfo.publishers ||
      this.data.addinfo.managers
    ) {
      if (this.data.addinfo.publishers) {
        this.mainForm.value.connected_users.p = this.mainForm.value.connected_users.p.map((user) => user._id);
        // @ts-ignore
        this.objectReadyToSend.userObject.connected_users.p = this.data.addinfo.publishers || this.mainForm.value.connected_users.p;
      }

      if (this.data.addinfo.managers) {
        this.mainForm.value.connected_users.am = this.mainForm.value.connected_users.am.map((user) => user._id);
        // @ts-ignore
        this.objectReadyToSend.userObject.connected_users.am = this.data.addinfo.managers || this.mainForm.value.connected_users.am;
      }
      // this.objectReadyToSend.userObject['domains'] = this.data.addinfo.domains ||
      //   this.mainForm.value.domains;
      // @ts-ignore
      this.objectReadyToSend.userObject.commission = this.data.addinfo.commission || this.mainForm.value.commission;
    }
    if (this.data.addinfo.editable) {
      this.flashMessage.flash('error', this.message, 3000, 'top');
    }
  }

  prepareObjectToSend() {
    if (this.data.addinfo && this.data.addinfo.waschanged === true) {
      this.objectPreparation();
      return true;
    } else {
      return false;
    }
  }

  public submit() {
    // функция отправки формы на сервер
    if (this.prepareObjectToSend()) {
      let isUnique = true;
      for (const u of this.data.allUsers) {
        if (this.user._id === u._id) {
          continue;
        }
        // @ts-ignore
        if (u.email === this.objectReadyToSend.userObject.email && u.name !== this.objectReadyToSend.userObject.name) {
          isUnique = false;
          this.snack.open('User with this email or name already exist', 'OK', {
            duration: 4000,
            panelClass: 'mat-color-white'
          });
        }
      }
      // tslint:disable-next-line:no-unused-expression
      isUnique ? this.dialogRef.close(this.objectReadyToSend) : '';
    } else {
      this.dialogRef.close(false);
    }
  }

  public discardChanges(): void {
    if (this.data.addinfo && this.data.addinfo.waschanged === true) {
      this.isDiscardPopup = true;
    } else {
      this.dialogRef.close(false);
    }
  }

  public approveDiscardPopup(): void {
    this.dialogRef.close(false);
  }

  public denyDiscardPopup(): void {
    this.isDiscardPopup = false;
  }

  roleChosen(role) {
    role === ROLES.PUBLISHER ? (this.potentialForWbid = true) : (this.potentialForWbid = false);
    role === ROLES.PARTNER ? (this.isRTBFormEnabled = true) : (this.isRTBFormEnabled = false);
  }

  get isChangedStatus() {
    const oneTimeActivate = ['AD OPS'];
    const allTimeCanChange = ['ADMIN', 'CEO'];
    if (this.user._id && oneTimeActivate.includes(this.currentUser.role)) {
      return this.user.enabled.changed;
    }
    if (allTimeCanChange.includes(this.currentUser.role)) {
      return false;
    }
    return false;
  }

  changeStatus() {
    const oneTimeActivate = ['AD OPS'];
    const allTimeCanChange = ['ADMIN', 'CEO'];
    const valueChange = !this.mainForm.get('enabled').get('status').value;
    if (this.user._id && oneTimeActivate.includes(this.currentUser.role)) {
      this.mainForm.get('enabled').get('changed').setValue(valueChange);
    }
    if (allTimeCanChange.includes(this.currentUser.role)) {
      this.mainForm.get('enabled').get('changed').setValue(valueChange);
    }
  }

  public updatedAccountManager(accountManager: any): void {
    this.owner.id = accountManager.id;
    this.owner.name = accountManager.name;
    this.owner.show = true;
    this.owner.date_to_connect_am = null;
    this.mainForm.get('am').setValue({
      _id: accountManager.id,
      name: accountManager.name
    });
  }
}
