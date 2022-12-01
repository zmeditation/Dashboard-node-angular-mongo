import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Config, User, ConfigsRow } from '../services/models';
import { catchError } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { RXBox } from 'rxbox';
import { WbidService } from '../services/shared.service';
import { egretAnimations } from 'shared/animations/egret-animations';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ShowHistoryDialogComponent } from './show-history-dialog.component';
import { ShowTagsDialogComponent } from './show-tags-dialog.component';
import { AdsTxtDialogComponent } from './ads-txt-dialog.component';
import { EditSiteDomainDialogComponent } from './edit-site-domain-dialog.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  animations: egretAnimations,
  encapsulation: ViewEncapsulation.Emulated
})
export class DataTableComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild('config') table: any;

  public currentRoute: string;

  public users: User[] = [];

  public sites = [];

  public tempSites = [];

  public tempUsers: User[] = [];

  public configs: Config[] = [];

  public expanded: ConfigsRow = {
    name: '',
    id: null,
    adapters: [],
    type: '',
    sizes: '',
    amazon: '',
    cmp: ''
  };

  public tempConfigs: Config[] = [];

  public usersReady = false;

  public configsReady = false;

  public title = '';

  public href = '';

  public loading = true;

  public sitesReady = false;

  public currentUser: '';

  public currentUserId: ''; // current publisher's ID

  public currentSiteId: ''; // current site ID

  public socketId: string;

  public userType: string[];

  public role: string;

  // public socket: string;
  private unsubscribe$ = new Subject();

  public isVisibleBackButton: boolean;

  public isVisibleNewButton: boolean;

  private innerWidth: number;

  clear: boolean;

  dashboardId: string;

  buttonDisabled = false;

  constructor(
    private router: Router,
    private crudService: CrudService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private flashMessage: FlashMessagesService,
    public store: RXBox,
    private shared: WbidService,
    public translate: TranslateService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public NgxPermissionsS: NgxPermissionsService
  ) {
    this.matIconRegistry.addSvgIcon('amazon', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/amazon.svg'));
    this.matIconRegistry.addSvgIcon('WMG', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/WMG.svg'));
    this.matIconRegistry.addSvgIcon('preview', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/preview.svg'));
    this.innerWidth = window.innerWidth;
  }

  async ngOnInit() {
    this.activatedRoute.queryParams.takeUntil(this.unsubscribe$).subscribe((data) => {
      if (data.userId) {
        this.currentUserId = data.userId;
        this.store.assignState({ currentUserId: data.userId });
      }

      if (data.siteId) {
        this.currentSiteId = data.siteId;
        this.store.assignState({ currentSiteId: data.siteId });
      }

      if (data.name) {
        this.currentUser = data.name;
        this.store.assignState({ currentUser: data.name });
      }
    });

    if (!this.store.getState().role) {
      const { id, isPrebidUser, userType, name, role, dashboardId } = await this.shared.getAndSaveUserData(this.currentUserId);
      this.store.assignState({
        id,
        isPrebidUser,
        userType,
        name,
        role,
        dashboardId
      });
    }

    this.role = this.store.getState().role;
    this.currentRoute = this.getCurrentRoute();

    if (this.currentRoute.includes('users')) {
      this.title = 'All users';
      this.getUsersList();
    } else if (this.currentRoute.includes('sites?')) {
      const id = this.currentUserId;
      if (!id) { this.router.navigate(['wbid']).catch((e) => console.error(e)); }

      this.getUserSites(id);
    } else {
      const id = this.currentSiteId;
      if (!id) { this.router.navigate(['wbid']).catch((e) => console.error(e)); }

      await this.getUserConfigs(id);
    }
  }

  getCurrentRoute(): string {
    return this.router.routerState.snapshot.url.replace('/', '');
  }

  getUsersList(): void {
    this.crudService
      .getUsersList()
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return Observable.throwError(err);
        })
      )
      .takeUntil(this.unsubscribe$)
      .subscribe(
        (data) => {
          if (data.length === 0) {
            this.loading = false;
            return this.translate.get('WBID.PROPERTIES.TABLE.NO_USERS').subscribe((message: string) => {
              this.flashMessage.flash('error', message, 3500, 'center');
              this.router.navigate(['dashboard']).catch((e) => console.error(e.message || e));
            });
          }
          this.users = data;
          this.tempUsers = this.users;
          this.usersReady = true;
          this.getVisible();
          this.loading = false;
        },
        (err) => {
          console.error(err.message || err);
        }
      );
  }

  getUserSites(id: string) {
    this.crudService
      .getUserSites(id)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return Observable.throwError(err);
        })
      )
      .takeUntil(this.unsubscribe$)
      .subscribe(
        (data) => {
          this.title = data.name;
          this.sites = data.sites;
          this.dashboardId = data.dashboardId;
          this.tempSites = this.sites;
          this.loading = false;
          this.userType = data.wbidType;
          this.store.assignState({
            userType: this.userType,
            dashboardId: this.dashboardId
          });
          this.getVisible();
          this.sitesReady = true;
          if (Object.keys(this.NgxPermissionsS.getPermissions()).includes('canSeeWBidStatusAdsTxt')) {
            this.sites.forEach((site) => this.crudService.getAdsTxt([site.domain]).subscribe((res) => {
              site.adsTxt = res;
              if (res[0] && res[0].adsTxtStrings) {
                if (res[0].adsTxtStrings === false) { return (site.ebda = false); }

                for (const ad of res[0].adsTxtStrings) { if (ad.present === false) { return (site.ebda = false); } }


                if (site.ebda !== false) { site.ebda = true; }

              }
            })
            );
          }


        },
        (err) => {
          console.error(err.message || err);
        }
      );
  }

  getUserConfigs(id: string): void {
    this.crudService
      .getUserConfigs(id)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return Observable.throwError(err);
        })
      )
      .takeUntil(this.unsubscribe$)
      .subscribe(
        (data) => {
          this.configs = data.configs;
          this.title = data.name;
          this.tempConfigs = this.configs;
          this.userType = this.store.getState().userType;
          if (this.role === 'PUBLISHER' && !this.userType.includes('prebid')) {
            this.configs = this.configs.filter((config) => config.type !== 'prebid');
          }

          if (this.role === 'PUBLISHER' && !this.userType.includes('postbid')) {
            this.configs = this.configs.filter((config) => config.type !== 'postbid');
          }

          this.configsReady = true;
          this.getVisible();
          this.loading = false;
        },
        (err) => {
          console.error(err.message || err);
        }
      );
  }

  search(event): void {
    if (this.currentRoute.includes('users')) {
      this.searchUser(event);
    } else if (this.currentRoute.includes('sites?')) {
      this.searchSite(event);
    } else if (this.currentRoute.includes('configs?')) {
      this.searchConfig(event);
    }

  }

  searchUser(event): void {
    const val = event.target.value.toLowerCase();
    this.users = this.tempUsers.filter((d) => {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val || d.domains.toString().toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  searchSite(event): void {
    const val = event.target.value.toLowerCase();
    this.sites = this.tempSites.filter((d) => {
      return d.domain.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  searchConfig(event): void {
    const val = event.target.value.toLowerCase();
    this.configs = this.tempConfigs.filter((d) => {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
  }

  editSiteDomain(row: { domain: string; id: number }): void {
    event.stopPropagation();
    if (sessionStorage.getItem('socketId') !== null) { this.socketId = JSON.parse(sessionStorage.getItem('socketId')).socket; }

    const dialogRef = this.dialog.open(EditSiteDomainDialogComponent, {
      data: { domain: row.domain }
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result || result === row.domain) {
        return;
      } else {
        for (const site of this.sites) {
          if (site.domain === result) {
            return this.translate.get('WBID.PROPERTIES.TABLE.DOMAIN_ALREADY_EXIST').subscribe((message: string) => {
              this.flashMessage.flash('error', message, 3500, 'center');
            });
          }
        }


        const res = await this.crudService.editSite(row.id, result, undefined, this.socketId);
        if (res.name && res.name === 'Error') { return; }

        this.sites.forEach((site) => {
          if (site.domain === row.domain && site.id === row.id) { site.domain = result; }

        });
      }
    });
  }

  showAdsTxt(site) {
    if (site.name && site.name === 'Error') { return; } else { this.dialog.open(AdsTxtDialogComponent, { data: site }); }

  }

  onActivateUsers(event: any): void {
    if (event.type === 'click') {
      this.router
        .navigate(['wbid', 'sites'], {
          queryParams: { userId: event.row.id, name: event.row.name }
        })
        .catch((e) => console.error(e.message));
    }


  }

  onActivateSites(event: any): void {
    if (event.type === 'click') {
      this.router
        .navigate(['wbid', 'configs'], {
          queryParams: {
            siteId: event.row.id,
            userId: this.activatedRoute.snapshot.queryParams.userId,
            name: this.activatedRoute.snapshot.queryParams.name
          }
        })
        .catch((e) => console.error(e.message));
    }


  }

  deleteSite(row: ConfigsRow): void {
    event.stopPropagation();
    const warn = this.translate.get('WBID.PROPERTIES.TABLE.SITE_REMOVE_WARN').subscribe((message: string) => {
      this.flashMessage.flash('error', message, 5000, 'center', true);
      const prompt = this.flashMessage.showPromptMessage$.subscribe(async (data: boolean) => {
        if (data === true) {
          this.buttonDisabled = true;
          if (sessionStorage.getItem('socketId') !== null) {
            this.socketId = JSON.parse(sessionStorage.getItem('socketId')).socket;
          }

          for (let i = 0; i < this.sites.length; i++) {
            if (this.sites[i].id === row.id) {
              const res = await this.crudService.deleteSite(row.id, this.socketId);
              if (res.name && res.name === 'Error') {
                this.buttonDisabled = false;
                prompt.unsubscribe();
                warn.unsubscribe();
                return;
              }
              this.sites.splice(i, 1);
              this.sites = [...this.sites];
              this.buttonDisabled = false;
              prompt.unsubscribe();
              warn.unsubscribe();
            }
          }


        } else {
          prompt.unsubscribe();
          warn.unsubscribe();
        }
      });
    });
  }

  deleteConfig(row: ConfigsRow): void {
    const warn = this.translate.get('WBID.PROPERTIES.TABLE.PLACEMENT_REMOVE_WARN').subscribe((message: string) => {
      this.flashMessage.flash('error', message, 5000, 'center', true);
      const prompt = this.flashMessage.showPromptMessage$.subscribe(async (data) => {
        if (data === true) {
          if (sessionStorage.getItem('socketId') !== null) {
            this.socketId = JSON.parse(sessionStorage.getItem('socketId')).socket;
          }

          for (let i = 0; i < this.configs.length; i++) {
            if (this.configs[i].id === row.id) {
              if (!row.isCopy) {
                const res = await this.crudService.deleteConfig(row.id, this.socketId, row.name, this.currentSiteId);
                if (res.name && res.name === 'Error') {
                  prompt.unsubscribe();
                  warn.unsubscribe();
                  return;
                }
                this.configs.splice(i, 1);
                this.configs = [...this.configs];
                prompt.unsubscribe();
                warn.unsubscribe();
              } else {
                this.configs.splice(i, 1);
                this.configs = [...this.configs];
                prompt.unsubscribe();
                warn.unsubscribe();
              }
            }
          }


        } else {
          prompt.unsubscribe();
          warn.unsubscribe();
        }
      });
    });
  }

  async showCode(row: { id: string }): Promise<any> {
    const res: any = await this.crudService.getTags(row.id);
    this.dialog.open(ShowTagsDialogComponent, {
      data: {
        fulltag: res.fulltag,
        passbackTag: res.passbackTag
      },
      width: '50vw'
    });
  }

  toggleExpandRow(row: ConfigsRow): void {
    if (this.expanded.id && this.expanded.id !== row.id) { this.table.rowDetail.collapseAllRows(); }

    this.table.rowDetail.toggleExpandRow(row);
    this.expanded = row;
  }

  copy(row: ConfigsRow): void {
    let configCopy: Config;
    let index: number;

    for (let i = 0; i < this.configs.length; i++) {
      if (this.configs[i].id === row.id) {
        configCopy = {
          ...this.configs[i],
          isCopy: true,
          sizes: '',
          name: this.configs[i].name + '_(copy)'
        };
        index = i;
      }
    }


    this.configs.splice(index, 0, configCopy);
    this.configs = [...this.configs];
  }

  checkCopy(row): any {
    return {
      copy: row.isCopy
    };
  }

  back(): void {
    const route: string = this.getCurrentRoute();
    if (route.includes('sites?')) {
      this.router.navigate(['wbid', 'users']).catch((e) => console.error(e));
    } else if (route.includes('configs?')) {
      this.router
        .navigate(['wbid', 'sites'], {
          queryParams: {
            userId: this.currentUserId,
            name: this.currentUser
          }
        })
        .catch((e) => console.error(e));
    }


  }

  getVisible(): void {
    if (this.currentRoute.includes('users')) {
      this.isVisibleBackButton = false;
      this.isVisibleNewButton = false;
      return;
    } else if (!this.currentRoute.includes('users') && this.role === 'ADMIN') {
      this.isVisibleNewButton = true;
      this.isVisibleBackButton = true;
      return;
    } else if (!this.currentRoute.includes('users') && (this.role === 'ACCOUNT MANAGER' || this.role === 'SENIOR ACCOUNT MANAGER')) {
      this.isVisibleNewButton = true;
      this.isVisibleBackButton = true;
      return;
    } else if (!this.currentRoute.includes('users') && this.role === 'AD OPS') {
      this.isVisibleNewButton = true;
      this.isVisibleBackButton = true;
      return;
    } else if (this.role === 'PUBLISHER' && this.userType && this.userType.includes('prebid') && this.currentRoute.includes('sites?')) {
      this.isVisibleNewButton = true;
      this.isVisibleBackButton = false;
      return;
    } else if (this.role === 'PUBLISHER' && this.userType && this.userType.includes('prebid') && this.currentRoute.includes('configs?')) {
      this.isVisibleNewButton = true;
      this.isVisibleBackButton = true;
      return;
    } else if (this.role === 'PUBLISHER' && this.userType && !this.userType.includes('prebid')) {
      this.isVisibleNewButton = false;
      this.isVisibleBackButton = !this.currentRoute.includes('sites?');
      return;
    } else {
      this.isVisibleBackButton = true;
      this.isVisibleNewButton = false;
    }
  }

  getConfigInfo(row: { id: number }): void {
    this.crudService.getPlacementHistory(row.id).subscribe((data: Array<any>) => {
      this.dialog.open(ShowHistoryDialogComponent, { data: data });
    });
  }

  getCurrentWindowWidth(): number {
    return window.innerWidth;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
