/** @format */

import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Observer, Subscription } from 'rxjs';
import { CrudService } from 'shared/services/cruds/crud.service';
import { AuthService } from 'shared/services/auth/auth.service';
import { TemporaryTokenStorageService } from 'shared/services/temporary-token-storage.service';
import { UsersEndpointsService } from 'shared/services/cruds/users-endpoints.service';
import { AppLoaderService } from 'shared/services/app-loader/app-loader.service';
import { AppConfirmService } from 'shared/services/app-confirm/app-confirm.service';
import { egretAnimations } from 'shared/animations/egret-animations';
import { ROLES } from 'shared/interfaces/roles.interface';
import { UsersRoleTableComponent } from './users-role-table/users-role-table.component';
import { UserPopUpComponent } from './user-pop-up/user-pop-up.component';
import { User } from 'shared/interfaces/users.interface';

@Component({
  selector: 'app-show-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: egretAnimations
})
export class UsersComponent implements OnDestroy {
  protected subscriptions: Subscription[] = [];

  @ViewChild(UsersRoleTableComponent)
  protected usersRoleTable: UsersRoleTableComponent;

  protected startRoleName: string = ROLES.PUBLISHER;

  public roles: string[] = [];

  public rolesTabs: Observable<string[]>;

  public currentTabIndex = 0;

  public isLoadingResults = true;

  protected activeTabWidth = 0;

  public constructor(
    private tempTokenStorageService: TemporaryTokenStorageService,
    private authService: AuthService,
    protected translate: TranslateService,
    protected dialog: MatDialog,
    protected snack: MatSnackBar,
    protected router: Router,
    protected crudService: CrudService,
    protected usersEndpoints: UsersEndpointsService,
    protected confirmService: AppConfirmService,
    protected loader: AppLoaderService
  ) {
    this.getTabs();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  protected getTabs(): void {
    this.rolesTabs = new Observable((observer: Observer<string[]>) => {
      this.subscriptions.push(
        this.usersEndpoints.getRoles().subscribe((data) => {
          const roles: string[] = data.roles;
          this.roles.push(this.startRoleName);

          for (let i = 0; i < roles.length; i++) {
            if (this.roles[0] !== roles[i]) {
              this.roles.push(roles[i]);
            }
          }
          observer.next(this.roles);
        })
      );
    });
  }

  public changeTab(event: any): void {
    this.isLoadingResults = true;
    this.currentTabIndex = event.index;
  }

  public searchAll(event: any): void {
    const activeElement: any = document.querySelector('mat-ink-bar');
    this.activeTabWidth = activeElement.style.width;
    activeElement.style.width = 0;

    this.usersRoleTable.search(event);
  }

  protected toggleLoading(event: any): void {
    this.isLoadingResults = event.loading;
  }

  /**
   * @todo refactor
   */
  public createUser(): void {
    const dialogRef: MatDialogRef<any> = this.dialog.open(UserPopUpComponent, {
      width: '840px',
      height: 'auto',
      disableClose: true,
      data: {
        title: 'Add new user',
        payload: {},
        edit: false,
        allUsers: []
      }
    });

    this.subscriptions.push(
      dialogRef.beforeClosed().subscribe((data) => {
        if (data) {
          this.loader.open('Please wait', '840px');

          const queryBidUser: any = {
            name: data.userObject.name,
            wbidType: data.userObject.wbidType,
            wbidUserId: data.userObject.wbidUserId,
            method: 'POST',
            dashboardId: data._id
          };

          if (data.userObject.wbidType.length > 0) {
            queryBidUser.path = '/createUser';
            this.subscriptions.push(
              this.usersEndpoints.addUserWbid(queryBidUser).subscribe((addWbidUserData) => {
                queryBidUser.path = '/updateUser';
                queryBidUser.wbidUserId = addWbidUserData.results.user.id;

                if (addWbidUserData.results.user) {
                  data.userObject.wbidUserId = addWbidUserData.results.user.id;
                } else {
                  data.userObject.wbidType = [];
                }

                this.subscriptions.push(
                  this.usersEndpoints.createUser(data).subscribe(
                    (addUserData) => {
                      queryBidUser.dashboardId = addUserData.userObject._id;

                      this.usersRoleTable.updateTableAfterCreateUser();
                      this.snack.open('Member Added!', 'OK', { duration: 4000 });
                      this.loader.close();

                      this.subscriptions.push(this.crudService.updateUserWbid(queryBidUser).subscribe());
                    },
                    (err) => {
                      this.errorCreateUser(err);
                    }
                  )
                );
              })
            );
          } else if (data.userObject.wbidType.length === 0) {
            this.subscriptions.push(
              this.usersEndpoints.createUser(data).subscribe(
                (_data) => {
                  this.usersRoleTable.updateTableAfterCreateUser();
                  this.snack.open('Member Added!', 'OK', { duration: 4000 });
                  this.loader.close();
                },
                (err) => {
                  this.errorCreateUser(err);
                }
              )
            );
          }
        }
      })
    );
  }

  protected errorCreateUser(response: any): void {
    this.loader.close();
    this.createUser();
    if (response.error.msg === 'ERROR_USER_ALREADY_EXIST') {
      this.translate.get('USERS_PAGE.USERS_TABLE.ERRORS.' + response.error.msg).subscribe((translation: string) => {
        this.snack.open(translation, 'OK', { duration: 4000, panelClass: 'mat-color-white' });
      });
    } else {
      this.snack.open(response.error.msg, 'OK', { duration: 4000, panelClass: 'mat-color-white' });
    }
  }

  /**
   * @todo refactor
   */
  public editUser(user: User): void {
    const adapterState = user.adWMGAdapter;
    user._id = user.id;

    const dialogRef: MatDialogRef<any> = this.dialog.open(UserPopUpComponent, {
      width: '840px',
      height: 'auto',
      disableClose: true,
      data: {
        title: 'Update user',
        payload: user,
        edit: true,
        allUsers: this.usersRoleTable.getAllUsers()
      }
    });

    this.subscriptions.push(
      dialogRef.beforeClosed().subscribe((data: { userObject: User }) => {
        if (data) {
          if (adapterState !== data.userObject.adWMGAdapter) {
            let index;
            switch (data.userObject.adWMGAdapter) {
              case true: // add permission to see oRTB reports
                index = data.userObject.permissions.indexOf('canReadOwnOrtbReports');
                if (index === -1) {
                  data.userObject.permissions.push('canReadOwnOrtbReports');
                }
                break;
              case false: // remove permission to see oRTB reports
                index = data.userObject.permissions.indexOf('canReadOwnOrtbReports');
                if (index !== -1) {
                  data.userObject.permissions.splice(index, 1);
                }
                break;
              default:
            }
          }

          this.loader.open('Please wait', '840px');

          const queryBidUser: any = {
            name: data.userObject.name,
            wbidType: data.userObject.wbidType,
            wbidUserId: data.userObject.wbidUserId,
            method: 'POST',
            dashboardId: data.userObject.id
          };

          if (data.userObject.wbidUserId !== null) {
            queryBidUser.path = '/updateUser';

            this.subscriptions.push(
              this.crudService.updateUserWbid(queryBidUser).subscribe(() => {
                this.subscriptions.push(
                  this.usersEndpoints.updateUser(user.id, data).subscribe(
                    () => {
                      this.successEditUser(data.userObject, user.id);
                    },
                    (err) => {
                      this.errorEditUser(err, user);
                    }
                  )
                );
              })
            );
          } else if (data.userObject.wbidType.length > 0) {
            queryBidUser.path = '/createUser';

            this.crudService.addUserWbid(queryBidUser).subscribe((addWbidUserData) => {
              if (addWbidUserData.results.user) {
                data.userObject.wbidUserId = addWbidUserData.results.user.id;
                data.userObject.wbidType = addWbidUserData.results.user.wbidType;
              }

              this.subscriptions.push(
                this.usersEndpoints.updateUser(user.id, data).subscribe(
                  () => {
                    this.successEditUser(data.userObject, user.id);
                  },
                  (err) => {
                    this.errorEditUser(err, user);
                  }
                )
              );
            });
          } else if (data.userObject.wbidType.length === 0) {
            this.subscriptions.push(
              this.usersEndpoints.updateUser(user.id, data).subscribe(
                () => {
                  this.successEditUser(data.userObject, user.id);
                },
                (err) => {
                  this.errorEditUser(err, user);
                }
              )
            );
          }
        }
      })
    );
  }

  protected successEditUser(data: any, id: string | number): void {
    data._id = id;
    this.usersRoleTable.updateTableAfterEditUser(data);
    this.snack.open('User Updated!', 'OK', { duration: 4000 });
    this.loader.close();
  }

  protected errorEditUser(response: any, user: any): void {
    this.loader.close();
    this.editUser(user);
    this.snack.open(response.error.msg, 'OK', { duration: 4000, panelClass: 'mat-color-white' });
  }

  /**
   * @todo refactor
   */
  protected deleteUser(user: any): void {
    if (user.wbidUserId !== null) {
      const queryBidUser = {
        name: user.name,
        id: user.wbidUserId,
        method: 'POST',
        path: '/deleteUser'
      };

      this.subscriptions.push(
        this.confirmService.confirm({ message: `Delete ${ user.name }?` }).subscribe((confirmServiceData) => {
          if (confirmServiceData) {
            this.subscriptions.push(
              this.crudService.deleteUserWbid(queryBidUser).subscribe((deletedWbidUser) => {
                if (deletedWbidUser) {
                  this.loader.open('Deleting', '840px');
                  this.subscriptions.push(
                    this.crudService.deleteUser(user).subscribe(() => {
                      this.usersRoleTable.updateTableAfterDeleteUser(user._id);
                      this.snack.open('Member deleted!', 'OK', { duration: 4000 });
                      this.loader.close();
                    })
                  );
                }
              })
            );
          }
        })
      );
    } else {
      this.subscriptions.push(
        this.confirmService.confirm({ message: `Delete ${ user.name }?` }).subscribe((confirmServiceData) => {
          if (confirmServiceData) {
            this.loader.open('Deleting', '840px');
            this.subscriptions.push(
              this.crudService.deleteUser(user).subscribe(() => {
                this.usersRoleTable.updateTableAfterDeleteUser(user._id);
                this.snack.open('User deleted!', 'OK', { duration: 4000 });
                this.loader.close();
              })
            );
          }
        })
      );
    }
  }

  protected propertiesUser(data: User): void {
    this.router.navigate(['/users', 'properties', data.id]);
  }

  protected userDetails(user: User): void {
    this.authService.publisherViewAuth(user.id).subscribe(
      ({ token, user }) => {
        this.tempTokenStorageService.publisherViewToken = token;
      }
    );
    // this.router.navigate(['/users', 'overview', user.id]);
  }
}
