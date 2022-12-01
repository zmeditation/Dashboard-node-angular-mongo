import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Roles } from '../../../../views/pages/settings/permissions/interfaces';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserDataForCreateMessage, CreateNewMessage } from 'shared/interfaces/notifications.interface';
import { GetUsersQuery } from 'shared/interfaces/users.interface';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { NotificationCrudService } from '../_services/notification-crud.service';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.scss']
})
export class CreateNotificationComponent implements OnInit, OnDestroy {
  public usersFiltered: Observable<any>;

  public rolesArray: Set<Roles> = new Set();

  public selectedRole: Roles;

  public allUsers: UserDataForCreateMessage[] = [];

  public selectedUsersByRole: UserDataForCreateMessage[] = [];

  public selectedUser: UserDataForCreateMessage;

  public form: FormGroup;

  public isCreateNewMessage = false;

  public isValidForm = true; // for enabled button for init

  public notificationsType = [
    {
      type: 'SYSTEM_NOTIFICATIONS',
      typeDB: 'systemNf'
    },
    {
      type: 'USERS_NOTIFICATIONS',
      typeDB: 'userNf'
    },
    {
      type: 'BILLING_NOTIFICATIONS',
      typeDB: 'billingNf'
    }
  ];

  private subscriptions: Subscription = new Subscription();

  private formSub: Subscription = new Subscription();

  constructor(private notificationS: NotificationCrudService, private flashMessage: FlashMessagesService) {}

  ngOnInit() {
    this.form = new FormGroup({
      notificationType: new FormControl('', Validators.required),
      roles: new FormControl('', Validators.required),
      users: new FormControl(''),
      message: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(100), this.validateMessage])
    });

    this.getUsersData();
    this.initSubscriptions();

    this.usersFiltered = this.form.get('users').valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : '')),
      map((filter) => this._filterUsers(filter))
    );
  }

  private _filterUsers(value: string): any {
    return this.selectedUsersByRole.filter((option) => option.name.toLowerCase().includes(value.toLowerCase()));
  }

  private validateMessage(message: FormControl): { [key: string]: any } | null {
    const text = message.value;
    if (text) { return text.replace(/\s/g, '').length > 4 ? null : { incorrect: true }; } 
  }

  public async submitMessage(formDirective: FormGroupDirective): Promise<void> {
    if (this.form.status === 'INVALID') {
      this.formSubscribe();
      return;
    }
    this.formSub.unsubscribe();

    const params = await this.createMsgObj();

    this.notificationS.createMessage(params).subscribe((res) => {
      const message = `Created ${ res.createdMsgs } messages.`;

      formDirective.resetForm();
      this.flashMessage.flash('success', message, 3000, 'top');
    });
  }

  private formSubscribe(): void {
    this.formSub = this.form.valueChanges.subscribe(() => {
      this.form.status === 'VALID' ? (this.isValidForm = true) : (this.isValidForm = false);
    });
  }

  private async createMsgObj(): Promise<CreateNewMessage> {
    const params: CreateNewMessage = {
      msg: {
        event: 'customNotice',
        text: this.form.get('message').value
      },
      msgType: this.form.get('notificationType').value,
      usersId: this.selectedUser && [this.selectedUser._id],
      userRoles: [this.form.get('roles').value]
    };

    return params;
  }

  getUsersData() {
    const query: GetUsersQuery = {
      findBy: ['ALL'],
      options: '_id name role'
    };

    const getusersSub = this.notificationS.getUsers(query).subscribe((data) => {
      const { publishers } = data;

      this.allUsers = publishers;
      this.setRolesTypes(publishers);
    });
    this.subscriptions.add(getusersSub);
  }

  private setRolesTypes(users: UserDataForCreateMessage[]) {
    users.forEach((obj) => {
      this.rolesArray.add(obj.role);
    });
  }

  private selectUsersByRole(role: Roles) {
    this.selectedUsersByRole = this.allUsers.filter((obj) => obj.role === role);
    this.form.get('users').setValue('');
  }

  private selectUsers(name: string) {
    this.selectedUser = this.selectedUsersByRole.find((obj) => obj.name === name);
  }

  private initSubscriptions(): void {
    const rolesChanged = this.form.controls.roles.valueChanges.subscribe((value: Roles) => this.selectUsersByRole(value));
    this.subscriptions.add(rolesChanged);

    const usersChanged = this.form.controls.users.valueChanges.subscribe((name: string) => this.selectUsers(name));
    this.subscriptions.add(usersChanged);
  }

  public toggleNotificationBlock(): void {
    this.isCreateNewMessage = !this.isCreateNewMessage;
    this.form.reset();
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) { this.subscriptions.unsubscribe(); } 
  }
}
