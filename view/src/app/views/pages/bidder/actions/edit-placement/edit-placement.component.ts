import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../services/crud.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { RXBox } from 'rxbox';
import { WbidService } from '../../services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { Currencies, EditQuery, Sizes, WbidConfig } from '../../services/models';
import { Helpers } from '../../services/helpers';
import { editForm } from '../../services/additional/editForm';
import { EditAdapterSettingsDialogComponent } from "./edit-adapter-settings-dialog.component";

@Component({
  selector: 'app-edit-config',
  templateUrl: './edit-placement.component.html',
  styleUrls: ['./edit-placement.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EditPlacementComponent implements OnInit, OnDestroy {
  _config: WbidConfig;

  toAllState: any;

  id: number;

  isCopy: boolean;

  userId: number;

  siteId: number;

  ready = false;

  query: EditQuery;

  currentUser = '';

  role: string;

  isPrebidUser: boolean;

  isPrebidConfig: boolean;

  analytics: string[];

  currencyArray: string[] = Currencies;

  newSettings: any;

  newAdapters: string[];

  newMarketplaceSettings: any;

  mainAdapters?: string[];

  analyticsOptions: any;

  preview: boolean;

  disabledForm: boolean;

  adWMGAnalyticsConfigIncorrect = false;

  formIsValid: boolean;

  allowedSizes: string[] = Sizes;

  dev: boolean;

  Form: FormGroup = editForm();

  private subscriptions: Subscription = new Subscription();

  constructor(
    private location: Location,
    private crudService: CrudService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public router: Router,
    private flashMessage: FlashMessagesService,
    public store: RXBox,
    private shared: WbidService,
    public translate: TranslateService,
    private helpers: Helpers
  ) {
  }

  async ngOnInit() {
    this.subscriptions.add(
      this.Form.statusChanges.subscribe((status) => {
        this.formIsValid = status === 'VALID';
        if (status === 'DISABLED') {
          this.disabledForm = true;
        }
      }))

    this.subscriptions.add(
      this.activatedRoute.queryParams.subscribe((data) => {
        this.id = data.id;
        this.isCopy = data.copy === 'true';
        this.currentUser = data.name;
        this.preview = data.preview === 'true';
      }))

    if (!Object.keys(this.store.getState()).length || this.store.getState().dashboardId === undefined) {
      this.subscriptions.add(this.crudService
        .getUserDataByConfigId(this.id)
        .subscribe(async (data) => {
          const { id, isPrebidUser, userType, name, role, dashboardId, permissions } = await this.shared.getAndSaveUserData(data.userId);
          this.store.assignState({
            id,
            isPrebidUser,
            userType,
            name,
            role,
            dashboardId,
            permissions
          });
          this.isPrebidUser = this.store.getState().userType.includes('prebid');
          this.role = this.store.getState().role;
        }))
    }

    this.getCurrentConfig(this.id);
    this.role = this.store.getState().role;

    if (this.preview === true) {
      this.Form.disable({ emitEvent: true });
    }

  }

  updateForm(): void {
    if (this.isPrebidConfig === true) {
      this.Form.controls.floorPrice.clearValidators();
      this.Form.controls.passbacktag.clearValidators();
      this.Form.controls.PREBID_TIMEOUT.clearValidators();
      this.Form.controls.networkId.setValidators([Validators.required, Validators.pattern(/([0-9]){5,20}/)]);
      this.Form.controls.adUnitCode.setValidators([Validators.required]);
      this.Form.controls.passbacktag.updateValueAndValidity();
      this.Form.updateValueAndValidity();
    }
    this.Form.controls.name.disable();
    this.Form.controls.name.setValue(this.currentUser);
    this.Form.updateValueAndValidity();
  }

  getCurrentConfig(id: number): void {
    this.subscriptions.add(this.crudService
      .getConfigById(id)
      .subscribe(
        (data) => {
          this._config = this.helpers.parseCurrentConfigData(data, this.isCopy);
          this.dev = this._config.dev;
          if (this._config.dev) {
            this.Form.controls.adExId.setValidators(Validators.required);
          } else {
            this.Form.controls.adExId.clearValidators();
          }

          this.ready = true;
          if (this.isCopy) {
            this.Form.controls.configname.enable();
          }

          this.Form.patchValue(this.helpers.prepareFormPatchObject(this._config, this.currentUser));

          if (this.store.getState().role === 'PUBLISHER') {
            this.Form.controls.marketplace.disable();
          }

          this.isPrebidConfig = this._config.typeOfConfig === 'prebid';
          this.updateForm();

          if (!this.isCopy) {
            this.Form.controls.sizes.disable();
            this.Form.controls.shortTag.disable();
          }
        },
        (err) => console.error(err.error || err)
      ))
  }

  changeAdaptersList(adapters: string[]): void {
    this.newAdapters = adapters;
  }

  changeAnalyticsList(analytics: string[]): void {
    this.analytics = analytics;
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router
        .navigate(['wbid', 'configs'], {
          queryParams: {
            siteId: this.siteId,
            userId: this.userId,
            name: this.currentUser
          }
        })
        .catch((e) => console.error(e.message));
    }
  }

  editAdapterSettings(adapter: string, marketplace?: boolean): void {
    const settingsArray = marketplace
      ? this._config.marketplace.settings[adapter]
        ? Object.entries(this._config.marketplace.settings[adapter])
        : undefined
      : Object.entries(this._config.existSettings[adapter]);
    const set = {};
    set[adapter] = {};
    if (settingsArray === undefined) {
      return;
    }

    const dialogRef = this.dialog.open(EditAdapterSettingsDialogComponent, {
      data: {
        adapter: { name: adapter, settings: settingsArray },
        preview: this.preview
      },
      panelClass: 'adapter-edit-dialog'
    });

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .subscribe((form: any) => {
          if (form) {
            const inputs: HTMLCollectionOf<Element> = form.getElementsByTagName('input');
            for (const f of (inputs as unknown) as any[]) {
              if (f.type === 'checkbox') {
                continue;
              }

              const key = f.placeholder;
              const data = f.value;
              const type = f.title;
              Object.assign(set[adapter], { [key]: { data, type } });
            }
            const disabled: HTMLCollectionOf<any> = form.getElementsByClassName('mat-slide-toggle-input');
            const targetChip: HTMLElement = document.getElementById(adapter);
            if (disabled[0]?.checked === true) {
              Object.assign(set[adapter], { disabled: { data: true, type: '' } });
              if (!targetChip.classList.contains('disabled')) {
                targetChip.classList.add('disabled');
              }

              if (!this._config.disabledAdapters.includes(adapter)) {
                this._config.disabledAdapters.push(adapter);
              }

            } else {
              Object.assign(set[adapter], {
                disabled: { data: false, type: '' }
              });
              if (targetChip.classList.contains('disabled')) {
                targetChip.classList.remove('disabled');
              }

              if (this._config.disabledAdapters.includes(adapter)) {
                this._config.disabledAdapters.splice(this._config.disabledAdapters.indexOf(adapter), 1);
              }

            }
            if (marketplace) {
              this._config.marketplace.settings[adapter] = set[adapter];
            } else {
              this._config.existSettings[adapter] = set[adapter];
            }
          }
        }));
  }

  toggleToAll(checked: boolean, value): void {
    this.toAllState = { checked, value };
    if (checked === true) {
      const settings = this._config.existSettings;
      Object.keys(this._config.existSettings).forEach((setting) => {
        settings[setting].floorPrice.data = value;
      });
      this._config.existSettings = settings;
    }
  }

  getOptions(analyticsOptions): void {
    this.analyticsOptions = analyticsOptions;
  }

  editConfig(): void {
    this.newSettings = this.helpers.assignAdaptersSettings('main', 'edit');
    this.newMarketplaceSettings = this.helpers.assignAdaptersSettings('marketplace', 'edit');

    this.query = this.helpers.prepareEditQuery(
      this.Form,
      this._config,
      this.isCopy,
      this.isPrebidConfig,
      this.id,
      this.currentUser,
      this.newAdapters,
      this.newSettings,
      this.analytics,
      this.analyticsOptions,
      this.newMarketplaceSettings,
      this.dev
    );

    // check adWMG Analytics settings
    if ((this.analytics?.length && this.analytics.includes('adWMG')) || this.query.analytics.includes('adWMG')) {
      const ao = JSON.parse(this.query.analyticsOptions);
      const adWMGSettings = [];
      adWMGSettings[0] = {
        publisher_id: this.store.getState().dashboardId
      };

      adWMGSettings[1] = {
        site: this.shared.getClearDomain(this.Form.controls.domain.value)
      };

      adWMGSettings[2] = {
        adUnitId: `${ this.Form.controls.configname.value }_${ this.query.width }x${ this.query.height }`
      };
      if (!this.analyticsOptions) {
        this.analyticsOptions = {};
      }

      ao.adWMG = adWMGSettings;
      this.query.analyticsOptions = JSON.stringify(ao);
    }
    if (this._config.marketplace.adapters) {
      this.query.adaptersList = JSON.stringify([].concat(JSON.parse(this.query.adaptersList), this._config.marketplace.adapters));
    }

    if (this.newMarketplaceSettings) {
      this.query.adaptersList = JSON.stringify(
        [].concat(JSON.parse(this.query.adaptersList), Object.keys(this.helpers.assignAdaptersSettings('marketplace', 'edit')))
      );
      this.query.settings = JSON.stringify(
        Object.assign(JSON.parse(this.query.settings), this.helpers.assignAdaptersSettings('marketplace', 'edit'))
      );
    }
    this.query.dashboardId = this.store.getState().dashboardId;
    this.query = this.checkDuplicateAdapters(this.query);
    let route;
    if (this.isCopy && this.Form.controls.shortTag.value === true) {
      route = 'getShortTag';
    } else if (this.isCopy && this.Form.controls.shortTag.value !== true) {
      route = 'addConfigToUser';
    } else if (!this.isCopy) {
      route = 'editPostbidConfig';
    }

    // query cleanup
    this.query = this.helpers.cleanEditQuery(this.query);
    this.store.assignState({ query: this.query, route: route });
    let socket;
    if (sessionStorage.getItem('socketId') !== null) {
      socket = JSON.parse(sessionStorage.getItem('socketId')).socket;
    }

    if (this.isCopy) {
      this.router.navigate(['wbid', 'tags']).catch((e) => console.error(e));
    } else if (!this.isCopy && this.isPrebidConfig) {
      this.showWaitMessage();
      this.subscriptions.add(
        this.crudService
          .editPrebidConfig(this.query, socket)
          .pipe(
            catchError((err: HttpErrorResponse) => {
              return throwError(err);
            })
          )
          .subscribe((response: any) => {
            this.processWbidResponse(response);
          }))
    } else if (this.Form.controls.shortTag.value === true) {
      this.showWaitMessage();
      this.subscriptions.add(
        this.crudService
          .editShortTagConfig(this.query, socket)
          .pipe(
            catchError((err: HttpErrorResponse) => {
              return throwError(err);
            })
          )
          .subscribe((response: any) => {
            this.processWbidResponse(response);
          }))
    } else {
      this.showWaitMessage();
      this.subscriptions.add(
        this.crudService
          .editPostbidConfig(this.query, socket)
          .pipe(
            catchError((err: HttpErrorResponse) => {
              return throwError(err);
            })
          )
          .subscribe((response: any) => {
            this.processWbidResponse(response);
          }))
    }
  }

  showWaitMessage() {
    this.flashMessage.flash('info',
      this.translate.instant('WBID.PROPERTIES.PLACEMENTS.CONFIG_UPDATE_WAIT'),
      1000000,
      'center');
  }

  processWbidResponse(response: any) {
    if (response?.name !== 'Error') {
      this.flashMessage.flash('success', this.translate.instant('WBID.PROPERTIES.PLACEMENTS.CONFIG_UPDATED'), 3000, 'center');
      return this.location.back();
    }
    this.flashMessage.flash('error', this.translate.instant('WBID.PROPERTIES.PLACEMENTS.CONFIG_UPDATE_ERROR'), 3000, 'center');
    this.location.back();
  }

  checkDuplicateAdapters(query: EditQuery): EditQuery {
    if (query.marketplace === true) {
      const marketplaceAdapters = JSON.parse(query.marketplaceSettings).adapters;
      const marketplaceSettings = JSON.parse(query.marketplaceSettings).settings;
      const duplicates = [];
      for (const adapter of marketplaceAdapters) {
        if (this.query.mainAdapters.includes(adapter)) {
          duplicates.push(adapter);
        }
      }

      if (duplicates.length) {
        duplicates.forEach((dupe) => {
          marketplaceAdapters.splice(marketplaceAdapters.indexOf(dupe), 1);
          delete marketplaceSettings[dupe];
        });
        query.marketplaceSettings = JSON.stringify({
          enabled: true,
          adapters: marketplaceAdapters,
          settings: marketplaceSettings
        });
      }
      return query;
    } else {
      return query;
    }
  }

  removeAdapter(adapter: string): void {
    const index: number = this._config.existAdapters.indexOf(adapter);
    this._config.existAdapters.splice(index, 1);
    this._config.existAdapters = [...this._config.existAdapters];
    delete this._config.existSettings[adapter];
  }

  removeAnalyticsAdapter(adapter: string): void {
    const index: number = this._config.existAnalyticsAdapters.indexOf(adapter);
    this._config.existAnalyticsAdapters.splice(index, 1);
    this._config.existAnalyticsAdapters = [...this._config.existAnalyticsAdapters];
    delete this._config.existAnalyticsOptions[adapter];
  }

  filterSlash(event): void {
    if (event?.key === '/') {
      event.target.value = event.target.value.replace(/\//g, '');
    }
  }

  checkTestValue(e) {
    this.dev = e.checked;

    if (e.checked === true) {
      this.Form.controls.adExId.setValidators(Validators.required);
    } else {
      this.Form.controls.adExId.clearValidators();
    }
    this.Form.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
