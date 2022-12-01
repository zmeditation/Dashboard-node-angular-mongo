import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventCollectorService } from 'shared/services/event-collector/event-collector.service';
import { Subscription } from 'rxjs';
import { CrudService } from 'shared/services/cruds/crud.service';

export interface UserData {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  address?: string;
  data?: string;
}

@Component({
  selector: 'app-user-settings-edit',
  templateUrl: './user-settings-edit.component.html',
  styleUrls: ['./user-settings-edit.component.scss']
})
export class UserSettingsEditComponent implements OnInit, OnDestroy {
  user: UserData = {};

  loading = true;

  private Subscriptions: Subscription[] = [];

  userData: Array<any> = [
    {
      name: 'Name',
      value: 'name'
    },
    {
      name: 'Email',
      value: 'email'
    },
    {
      name: 'Company',
      value: 'company'
    },
    {
      name: 'Address',
      value: 'address'
    },
    {
      name: 'Phone',
      value: 'phone'
    },
    {
      name: 'Birthday',
      value: 'birthday'
    }
  ];

  constructor(private event: EventCollectorService, private crud: CrudService) {}

  ngOnInit() {
    this.getUserInfo();
  }

  get userId() {
    let _id;
    this.Subscriptions.push(
      this.event.managedUserInfo$.subscribe((data) => {
        _id = data._id;
      })
    );
    return _id;
  }

  getUserInfo() {
    this.Subscriptions.push(
      this.crud.getUser(this.userId).subscribe((userData) => {
        const infoPath = userData.user || userData;
        this.user = this.createUserObject(infoPath);
        this.loading = false;
      })
    );
  }

  createUserObject(user) {
    const userAdditionalData = ['company', 'birthday', 'phone', 'address'];
    const userData = ['name', 'email'];
    const additionalInfo = user.additional;
    const object = {};

    if (additionalInfo) {
      for (const data of userAdditionalData) { if (additionalInfo[data]) { object[data] = additionalInfo[data]; } } 
    }  


    for (const data of userData) { if (user[data]) { object[data] = user[data]; } }  


    return object;
  }

  ngOnDestroy(): void {
    this.Subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
