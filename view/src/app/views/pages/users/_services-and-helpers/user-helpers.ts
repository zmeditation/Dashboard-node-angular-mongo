import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CrudService } from 'shared/services/cruds/crud.service';
import { AppLoaderService } from 'shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';

export class UserHelpers {
  public users: Array<any>;

  public allUsers: Array<any> = [];

  public temp: Array<any> = [];

  public showProgressBar = true;

  public tabs: Array<string> = [];

  public activeTab = 'PUBLISHER';

  public dialogueSub: Subscription[] = [];

  public countPages = 0;

  constructor(public snack: MatSnackBar, public router: Router, public crudService: CrudService, public loader: AppLoaderService) {}

  public getByRole(roles = ''): void {
    // Берет пользователей для таблицы
    this.dialogueSub.push(
      this.crudService.getUsers({ roles }).subscribe((data) => {
        if (data) {
          this.updateData(data.users);
          this.countPages = data.countPages;

          setTimeout(() => {
            this.showProgressBar = false;
            this.setStylesForTable();
          }, 0);
        }
      })
    );
  }

  public getAllUsersByValue(search: string): any {
    this.showProgressBar = true;

    this.crudService.getUsers({ search }).subscribe((data) => {
      if (data) {
        this.updateData(data.users);
        setTimeout(() => {
          this.showProgressBar = false;
        }, 0);
      }
    });
  }

  /*
    This function set style max-width: 100%
    for tag datatable-scroller after it initialized.
    It must remove bottom scrollbar in table for small screens
  */

  setStylesForTable() {
    const maxTries = 10;
    let counter = 0;
    function getAndSet(parent) {
      const scrollerOfTable = Array.from(document.getElementsByTagName('datatable-scroller'));
      if (counter > maxTries) { clearInterval(parent); } 

      if (!scrollerOfTable.length) {
        counter++;
        return null;
      }
      // @ts-ignore
      scrollerOfTable[0].style.maxWidth = '100%';
      clearInterval(parent);
      return true;
    }
    const actionFunc = (a): any => {
      return getAndSet(a);
    };
    const tempInterval = setInterval(() => actionFunc(tempInterval), 10);
  }

  updateData(data) {
    if (this.tabs !== undefined) {
      // this.tabs = undefined;
      this.allUsers = [];
      this.users = [];
      this.temp = [];
    }
    // this.tabs = await this.getTabs();
    this.allUsers = data;
    this.users = data;
    this.temp = data;
  }

  getFilteredUsers(event?, searchBar?): void {
    //  фильтрует пользователей по табам
    if (searchBar) { searchBar.value = ''; } 

    if (event) { this.activeTab = event.tab.textLabel; } 

    this.showProgressBar = true;
    this.getByRole(this.activeTab);

    this.users = this.allUsers;
    this.temp = this.allUsers;
  }

  manageUsers() {
    // функция хелпер по управлению с данными после закрытия попапа
    return {
      addNewU: (data) => {
        if (data.success !== false) {
          this.allUsers.push(data.userObject);
          this.allUsers = [...this.allUsers];
          this.snack.open('Member Added!', 'OK', { duration: 4000 });
          this.getByRole(this.activeTab);
          this.getFilteredUsers();
          this.loader.close();
        } else {
          this.snack.open(
            `Can't add member, reason: ${ Array.isArray(data.errors) ? data.errors[0] : data.msg.msg } `,
            'OK',
            { duration: 4000 }
          );
          this.loader.close();
        }
      },
      updateU: (data) => {
        const indexAll = this.allUsers.findIndex((x: any): any => {
          return x._id === data.userObject._id;
        });
        this.allUsers[indexAll] = data.userObject;
        const index = this.users.findIndex((x: any): any => {
          return x._id === data.userObject._id;
        });
        this.users[index] = data.userObject;
        this.snack.open('Member Updated!', 'OK', { duration: 4000 });
        this.getByRole(this.activeTab);
        this.getFilteredUsers();
        this.loader.close();
      },
      deleteU: (data, row) => {
        const i = this.users.indexOf(row);
        this.users.splice(i, 1);
        this.users = [...this.users];
        const iall = this.allUsers.indexOf(row);
        this.allUsers.splice(iall, 1);
        this.allUsers = [...this.allUsers];
        this.snack.open('Member deleted!', 'OK', { duration: 4000 });
        this.loader.close();
      },
      progressLoader: (title?, width?, height?) => {
        this.loader.open(title, width, height);
      }
    };
  }

  goToProperties(data) {
    sessionStorage.removeItem('user_prop_temp');
    sessionStorage.setItem('user_prop_temp', JSON.stringify({ object: { userObject: data }, id: data._id }));
    this.router.navigate(['/users', 'properties', data.name.toLowerCase()]);
  }
}
