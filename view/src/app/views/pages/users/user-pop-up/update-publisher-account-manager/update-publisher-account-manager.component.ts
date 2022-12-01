import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AccountManagerEndpointsService } from 'shared/services/cruds/account-manager-endpoints.service';
import { BindAccountManagerToPublisherParams } from 'shared/services/cruds/types';
import { AccountManager } from 'shared/types/users';

@Component({
  selector: 'app-update-publisher-account-manager',
  templateUrl: './update-publisher-account-manager.component.html',
  styleUrls: ['./update-publisher-account-manager.component.scss']
})
export class UpdatePublisherAccountManagerComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  @Input()
  public publisherId: string;

  @Input()
  public currentAccountManagerId: string | null;

  @Output()
  public updatedAccountManager = new EventEmitter();

  protected accountManagers: AccountManager[] = [];

  public selectValues: AccountManager[] = [];

  public searchValue = new FormControl();

  public selectedAccountManagerId = new FormControl();

  public showControls = false;

  public isLoading = true;

  public constructor(
    protected translate: TranslateService,
    protected snack: MatSnackBar,
    protected accountManagerEndpoints: AccountManagerEndpointsService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.accountManagerEndpoints
        .getAccountManagersByEditPermissions({
          sort: 'name:asc',
          include: JSON.stringify([
            {
              key: 'enabled.status',
              value: true
            }
          ])
        })
        .subscribe(
          (response) => {
            this.accountManagers = response.data;
            this.selectValues = this.accountManagers;
            this.isLoading = false;

            if (this.currentAccountManagerId) {
              this.selectedAccountManagerId.setValue(this.currentAccountManagerId);
            }
          },
          (response) => {
            console.error(response.error);

            this.isLoading = false;

            this.translate.get('USERS_PAGE.USERS_POPUP_COMPONENT.ERROR_LOAD_AM').subscribe((message) => {
              this.snack.open(message, 'OK', { duration: 10000 });
            });
          }
        )
    );
  }

  public search({ target: { value } }): void {
    if (!value) {
      this.selectValues = this.accountManagers;
    } else {
      this.selectValues = this.accountManagers.filter((element) => element.name.toLowerCase().includes(value.toLowerCase()));
    }
  }

  public checkNotSelectedValue(): void {
    if (!this.selectedAccountManagerId.value) {
      this.selectedAccountManagerId.setErrors(null);
    }
  }

  public onChangeAccountManager(): void {
    this.clearSearch();
    this.checkNewAccountManager();
  }

  protected clearSearch(): void {
    this.searchValue.setValue('');
    this.selectValues = this.accountManagers;
  }

  protected checkNewAccountManager(): void {
    if (this.currentAccountManagerId !== this.selectedAccountManagerId.value) {
      this.showControls = true;
    } else {
      this.showControls = false;
    }
  }

  public onFocusoutSelectSearch(): void {
    this.clearSearch();
  }

  public successSelectedAccountManager(): void | undefined {
    this.isLoading = true;
    if (this.currentAccountManagerId && this.currentAccountManagerId === this.selectedAccountManagerId.value) {
      return;
    }
    const requestParameters: BindAccountManagerToPublisherParams = {
      publisherId: this.publisherId,
      newAccountManagerId: this.selectedAccountManagerId.value
    };

    if (this.currentAccountManagerId) {
      requestParameters.currentAccountManagerId = this.currentAccountManagerId;
    }

    this.subscriptions.add(
      this.accountManagerEndpoints.bindAccountManagerToPublisher(requestParameters).subscribe(
        () => {
          this.updatedAccountManager.emit(this.accountManagers.filter((element) => element.id === this.selectedAccountManagerId.value)[0]);
          this.showControls = false;
          this.isLoading = false;
          this.translate.get('USERS_PAGE.USERS_POPUP_COMPONENT.SUCCESS_UPDATED_PUBLISHER_ACCOUNT_MANAGER').subscribe((message) => {
            this.snack.open(message, 'OK', { duration: 10000 });
          });
        },
        (response) => {
          console.error(response.error);

          this.isLoading = false;

          this.translate.get('USERS_PAGE.USERS_POPUP_COMPONENT.DENIED_UPDATED_PUBLISHER_ACCOUNT_MANAGER').subscribe((message) => {
            this.snack.open(message, 'OK', { duration: 10000 });
          });
        }
      )
    );
  }

  public denySelectedAccountManager(): void {
    this.selectedAccountManagerId.setValue(this.currentAccountManagerId);

    this.checkNewAccountManager();
    this.checkNotSelectedValue();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
