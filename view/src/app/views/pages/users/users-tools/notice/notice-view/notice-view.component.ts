import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransporterService } from 'shared/services/transporter.service';
import { Observable, Subscription } from 'rxjs';
import { NoticeType } from 'shared/types/notice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from 'shared/services/cruds/crud.service';
import { _filterObject } from 'shared/helpers/utils';
import { map, startWith } from 'rxjs/operators';
import { egretAnimations } from 'shared/animations/egret-animations';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-notice-view',
  templateUrl: './notice-view.component.html',
  styleUrls: ['./notice-view.component.scss'],
  animations: egretAnimations
})
export class NoticeViewComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();

  public notice: NoticeType;

  public noticeForm: FormGroup;

  public possibleTypes: string[] = ['warning', 'information'];

  public roles: string[] = [];

  public checkedUsersIds: string[] = [];

  public checkedUsersNames: string[] = [];

  public usersObservable: Observable<any>;

  public todayDate: Date = new Date();

  private users: any[] = [];

  private existingNotice: boolean = false;

  private queryToDelete: any = {
    _id: ''
  };

  constructor(
    private transporter: TransporterService,
    private _formBuilder: FormBuilder,
    private crud: CrudService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.setSubscriptions();
  }

  private setSubscriptions() {
    const noticeSubscription = this.transporter.message.subscribe(data => {
      this.buildForm(data);
      this.existingNotice = true;
      this.noticeForm.disable();
      this.noticeForm.get('notice_type').disable();
      this.noticeForm.get('target_roles').disable();
      this.queryToDelete._id = data._id;
    });
    const rolesSubscription = this.crud.getRoles().subscribe((resp) => {
      this.roles = resp.roles.filter(el => el !== 'ANALYTICS' && el !== 'WBID ANALYTICS USER' );
    });
    const usersSubscription = this.crud.getUsers({ limit: '5000' }).subscribe((resp) => {
      this.users = this.groupUsersByRole(resp.users);
      this.setObservableAutocompleteUsers();
    });
    this.subscriptions.add(noticeSubscription);
    this.subscriptions.add(rolesSubscription);
    this.subscriptions.add(usersSubscription);
  }

  private buildForm(data?: NoticeType) {
    this.noticeForm = this._formBuilder.group({
      creator: [{ value: data ? data.creator.name : '', disabled: true }],
      notice_type: [data ? data.notice_type : '', [Validators.required]],
      text: [data ? data.text : '', [Validators.maxLength(1024)]],
      remove_date: [data ? data.remove_date : ''],
      target_roles: [data ? data.target_roles : []],
      target_users: [this.setUsersNames(data)],
      title: [data ? data.title : '', [Validators.required]]
    })
  }

  private setUsersNames(data) {
    let result = [];
    if (data) {
      result = data.target_users.map(u => {
        this.checkedUsersNames.push(u.name);
        this.checkedUsersIds.push(u._id);
        return u.name;
      });
      this.users.forEach(group => {
        group.users.forEach(el => {
          if (this.checkedUsersIds.includes(el._id)) {
            el.selected = true;
          }
        })
      });
      return result.join(', ');
    }
    return result;
  }

  public clearValue() {
    if (this.noticeForm.get('target_users').value) {
      this.noticeForm.get('target_users').reset();
    }
  }

  private groupUsersByRole(data) {
    const temp = data.map(el => {
      return {
        name: el.name,
        _id: el._id,
        role: el.role,
        selected: false
      }
    });
    const groupedUsers = new Array(this.roles.length);
    this.roles.forEach((el, i) => {
      groupedUsers[i] = {
        role: el,
        users: temp.map(user => {
          if (user.role === el) {
            return user;
          }
          return false
        }).filter(user => user !== false)
      };
    });
    return groupedUsers.sort((a, b) => {
      if (a.role === 'PUBLISHER') { return -1 }
      return 0;
    });
  }

  setObservableAutocompleteUsers() {
    this.usersObservable = this.noticeForm.get('target_users')!.valueChanges
      .pipe(
        startWith<string>(''),
        map((value) => this._filterUsers(value))
      );
  }

  private _filterUsers(value: string) {
    if (value || '') {
      return this.users
        .map(group => {
          return { role: group.role, users: _filterObject(group.users, value, 'name') }
        })
        .filter(group => {
          if (group.users.length > 0) {
            return group.users;
          }
        });
    }
    return this.users;
  }

  public createNotice() {
    const objectToSend = this.noticeForm.getRawValue();
    objectToSend.target_users = this.checkedUsersIds;
    objectToSend.remove_date = formatDate(objectToSend.remove_date, 'yyyy-MM-dd', 'en_US');
    this.crud.createNotice({ query: objectToSend }).subscribe(resp => {
      this.clearForm();
    });
  }

  get isReadyForLoad() {
    return !!this.users.length;
  }

  public toggleCheckedUsers(user, event) {
    event.stopPropagation();
    const id = user._id;
    const name = user.name;
    user.selected = !user.selected;
    if (user.selected && !this.checkedUsersIds.includes(id)) {
      this.checkedUsersIds.push(id);
      this.checkedUsersNames.push(name)
    }

    if (!user.selected && this.checkedUsersIds.includes(id)) {
      const indexId = this.checkedUsersIds.indexOf(id);
      this.checkedUsersIds.splice(indexId, 1 );

      const indexName = this.checkedUsersNames.indexOf(name);
      this.checkedUsersNames.splice(indexName, 1 );
    }
    this.noticeForm.get('target_users').setValue(this.checkedUsersNames.join(', '));
  }

  public clearInputChecks() {
    this.checkedUsersIds = [];
    this.checkedUsersNames = [];
    this.users.forEach(group => {
      group.users.forEach(el => {
        if (el.selected) {
          el.selected = false;
        }
      })
    });
    this.noticeForm.get('target_users').setValue('');
  }

  public clearForm() {
    this.noticeForm.reset();
    this.noticeForm.enable();
    this.queryToDelete._id = '';
    this.existingNotice = false;
  }

  public get readyToGo() {
    return !this.noticeForm.valid;
  }

  public get readyToDelete() {
    return !this.existingNotice;
  }

  public deleteNotice() {
    const deletionSubscription = this.crud.deleteNotice(this.queryToDelete).subscribe(resp => {
      this.clearForm();
    });
    this.subscriptions.add(deletionSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
