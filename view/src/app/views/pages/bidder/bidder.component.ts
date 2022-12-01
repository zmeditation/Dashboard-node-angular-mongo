import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { CrudService } from './services/crud.service';
import { RXBox } from 'rxbox';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { EventCollectorService } from 'shared/services/event-collector/event-collector.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './bidder.component.html',
  styleUrls: ['./bidder.component.scss']
})
export class BidderComponent implements OnInit, OnDestroy {
  public userPermissions: any;

  public publisherId: string;

  public setupStatus: boolean;

  public wbidType: string[];

  public name: string;

  public role: string;

  public status: string[];

  public trialFrom: number;

  public successAdsTxtCheck: boolean;

  private unsubscribe$ = new Subject();

  private SubscriptionUserInfo: Subscription;

  constructor(
    public NgxPermissionsS: NgxPermissionsService,
    private router: Router,
    private crudService: CrudService,
    private store: RXBox,
    private flashMessage: FlashMessagesService,
    public event: EventCollectorService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.userPermissions = this.NgxPermissionsS.getPermissions();
    this.SubscriptionUserInfo = this.event.managedUserInfo$.subscribe((user: any) => {
      this.publisherId = user.wbidUserId;
      this.role = user.role;
      this.store.assignState({
        role: this.role,
        id: this.publisherId,
        name: user.name,
        permissions: Object.keys(this.userPermissions)
      });
      if (this.publisherId) { this.getUserSites(this.publisherId); } else { this.redirect(); }


    });
  }

  getUserSites(id: string): void {
    this.crudService
      .getUserSites(id)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return Observable.throwError(err);
        })
      )
      .takeUntil(this.unsubscribe$)
      .subscribe(
        (data: any) => {
          if (!data) {
            this.translate
              .get('WBID.PROPERTIES.PLACEMENTS.NO_CONFIG')
              .takeUntil(this.unsubscribe$)
              .subscribe((message: string) => {
                this.flashMessage.flash('error', message, 2000, 'center');
              });
            return this.router.navigate(['/']);
          }
          this.name = data.name;
          this.setupStatus = data.HBSetupStatus;
          this.wbidType = data.wbidType;
          this.status = data.status;
          this.trialFrom = data.trialFrom;
          this.successAdsTxtCheck = data.successAdsTxtCheck;
          if (!this.wbidType) {
            this.translate
              .get('WBID.PROPERTIES.PLACEMENTS.NO_CONFIG')
              .takeUntil(this.unsubscribe$)
              .subscribe((message: string) => {
                this.flashMessage.flash('error', message, 2000, 'center');
              });
            return this.router.navigate(['/']);
          }
          this.store.assignState({
            isPrebidUser: this.wbidType.includes('prebid'),
            userType: data.wbidType,
            dashboardId: data.dashboardId,
            status: data.status,
            trialFrom: data.TrialFrom,
            successAdsTxtCheck: data.successAdsTxtCheck
          });
          this.redirect();
        },
        (err) => {
          console.error(err.message || err);
        }
      );
  }

  redirect(): void {
    const permissions = Object.keys(this.userPermissions);

    if (permissions.includes('canSeeAllWBidUsers') || permissions.includes('canSeeOwnWBidUsers')) {
      this.router.navigate(['wbid', 'users']).catch((e) => console.error(e.message || e));
    } else if (permissions.includes('canCreateWBidPlacements') && this.setupStatus === false) {
      this.router.navigate(['wbid', 'start']).catch((e) => console.error(e.message || e));
    } else if (permissions.includes('canCreateWBidPlacements') && this.setupStatus === null) {
      this.router.navigate(['wbid', 'start', 'wait']).catch((e) => console.error(e.message || e));
    } else if (
      this.status && this.status.includes('trial') === true &&
      this.checkTrialEnd(this.trialFrom) && this.successAdsTxtCheck !== true
    ) {
      this.router.navigate(['wbid', 'trial']).catch((e) => console.error(e.message || e));
    } else {
      this.router
        .navigate(['wbid', 'sites'], {
          queryParams: {
            userId: this.publisherId,
            name: this.name
          }
        })
        .catch((e) => console.error(e.message || e));
    }
  }

  checkTrialEnd(trialFrom: number | string): boolean {
    return +new Date() > +new Date(+trialFrom + 6.048e8);
    // if trial started more then 7 days ago, trial mode ends (return true)
  }

  ngOnDestroy(): void {
    if (this.SubscriptionUserInfo !== undefined) { this.SubscriptionUserInfo.unsubscribe(); }

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
