import { Component, OnDestroy, OnInit } from '@angular/core';
import { RXBox } from 'rxbox';
import { WbidService } from '../services/shared.service';
import { CrudService } from '../services/crud.service';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-trial',
  templateUrl: './trial.component.html',
  styleUrls: ['./trial.component.scss']
})
export class TrialComponent implements OnInit, OnDestroy {
  checking = false;

  result = false;

  error: boolean;

  userText = '';

  id = '';

  name = '';

  socketId: string;

  results: any = [];

  copying = false;

  private unsubscribe$ = new Subject();

  constructor(
    private store: RXBox,
    private shared: WbidService,
    private flashMessage: FlashMessagesService,
    private crudService: CrudService,
    private router: Router,
    public translate: TranslateService
  ) {}

  async ngOnInit() {
    if (!Object.keys(this.store.getState()).length) {
      const { id, isPrebidUser, userType, name, role, dashboardId, trialFrom, status } = await this.shared.getAndSaveUserData();
      this.store.assignState({
        id,
        isPrebidUser,
        userType,
        name,
        role,
        dashboardId,
        trialFrom,
        status
      });
    }
    this.id = this.store.getState().id;
    this.name = this.store.getState().name;
    this.socketId = JSON.parse(sessionStorage.getItem('socketId')).socket;
  }

  checkAdsTxt(): void {
    this.result = false;
    this.checking = true;
    const perms = [
      'canSeeWBidChartsPage',
      'canSeeWBidTablesPage',
      'canCreateWBidPlacements',
      'canEditWBidPlacements',
      'canDeleteWBidPlacements',
      'canDeleteWBidSites',
      'canEditWBidSites',
      'canSeeWBidActions',
      'canSeeWBidMarketplace',
      'canReadOwnWBidReports'
    ];
    this.crudService
      .forceAdsTxtCheck(this.id, this.socketId)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return Observable.throwError(err);
        })
      )
      .takeUntil(this.unsubscribe$)
      .subscribe((data: any) => {
        this.checking = false;
        this.result = true;
        this.userText = data.result.isAdsTxtValid === true ? 'RESULT_SUCCESS' : 'RESULT_FAILED';
        this.error = this.userText === 'RESULT_FAILED';
        this.translate
          .get('WBID.PROPERTIES.TRIAL.' + this.userText)
          .takeUntil(this.unsubscribe$)
          .subscribe((message: string) => {
            this.flashMessage.flash(this.error === true ? 'error' : 'success', message, 3500, 'center');
          });
        if (!this.error) {
          this.crudService
            .editUserPermissions('ADDING_FOR_ONE', this.store.getState().dashboardId, perms)
            .pipe(
              catchError((err: HttpErrorResponse) => {
                return Observable.throwError(err);
              })
            )
            .takeUntil(this.unsubscribe$)
            .subscribe();
          setTimeout(() => {
            this.router
              .navigate(['wbid', 'sites'], {
                queryParams: {
                  userId: this.id,
                  name: this.name
                }
              })
              .catch((e) => console.error(e.message || e));
          }, 5000);
        } else {
          this.crudService
            .editUserPermissions('DELETION_FOR_ONE', this.store.getState().dashboardId, perms)
            .pipe(
              catchError((err: HttpErrorResponse) => {
                return Observable.throwError(err);
              })
            )
            .takeUntil(this.unsubscribe$)
            .subscribe();
        }
        this.results = data.results;
      });
  }

  async copyHelper(value: string): Promise<any> {
    const copyhelper: HTMLTextAreaElement = document.createElement('textarea');
    copyhelper.className = 'copyhelper';
    document.body.appendChild(copyhelper);
    copyhelper.value = value;
    copyhelper.select();
    document.execCommand('copy');
    document.body.removeChild(copyhelper);
    return;
  }

  copyAdsTxtLines(domain: string): void {
    this.copying = true;
    if (this.results && this.results.result && this.results.result.length) {
      for (const res of this.results.result) {
        if (domain === res.domain) {
          const list: Array<any> = res.adsTxtStrings;
          const result = [];
          for (const el of list) {
            result.push(`
            ${ el.domain }, 
            ${ el.publisherAccountID }, 
            ${ el.accountType }${ el.certificateAuthorityID ? ',' : '' } 
            ${ el.certificateAuthorityID || '' }`);
          }
          if (navigator.clipboard) {
            navigator.clipboard.writeText(result.join('\r\n')).catch((err) => console.error(err));
          } else {
            this.copyHelper(result.join('\r\n')).catch((err) => console.error(err));
          }

        }
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
