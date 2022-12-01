import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RXBox } from 'rxbox';
import { WbidService } from '../../services/shared.service';
import { CrudService } from '../../services/crud.service';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { TranslateService } from '@ngx-translate/core';
import { Currencies, Sizes } from '../../services/models';
import { Helpers } from '../../services/helpers';
import { addForm } from '../../services/additional/addForm';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-placement.component.html',
  styleUrls: ['./add-placement.component.scss']
})
export class AddPlacementComponent implements OnInit, OnDestroy {
  currentRoute: string;

  toAllState: { checked: boolean; value: number | string };

  adapters: string[] = [];

  currentUser: string; // publisher's name

  currentUserId: string; // publishers' ID

  currentSiteId: string; // site ID

  currentDomain: string; // site domain

  isPrebidUser: boolean;

  userType: string[];

  analytics: any;

  analyticsOptions: any;

  role: string;

  currencyArray: string[] = Currencies;

  marketplace = false;

  marketplaceSettings: any;

  formIsValid: boolean;

  adWMGAnalyticsConfigIncorrect = false;

  existDomains: string[];

  dev = false;

  form: FormGroup = addForm();

  adaptersList = this.form.controls.adaptersList;

  allowedSizes: string[] = Sizes;

  private subscriptions: Subscription = new Subscription();

  @ViewChild('adaptersInput') adaptersInput: ElementRef<HTMLInputElement>;

  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @Output() toAllToggle = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: RXBox,
    private shared: WbidService,
    private crudService: CrudService,
    private flashMessage: FlashMessagesService,
    public translate: TranslateService,
    private helpers: Helpers
  ) {}

  async ngOnInit() {
    this.subscriptions.add(
      this.form.statusChanges.subscribe((isValid) => {
        this.formIsValid = isValid === 'VALID';
      }))

    this.subscriptions.add(
      this.activatedRoute.queryParams.subscribe(
        (data) => {
          if (data.userId) {
            this.currentUserId = data.userId;
          }

          if (data.siteId) {
            this.currentSiteId = data.siteId;
          }

          if (data.name) {
            this.currentUser = data.name;
          }

          if (data.domain) {
            this.currentDomain = data.domain;
            if (this.currentDomain.length > 50) {
              this.currentDomain = this.currentDomain.substring(0, 50);
            }

          } else {
            this.subscriptions.add(this.crudService
              .getUserSites(this.currentUserId)
              .subscribe(
                (response: any) => {
                  if (response.sites) {
                    this.existDomains = response.sites.map((site: any) => site.domain);
                  }
                },
                (err) => console.error(err)
              ));
          }
        },
        (err) => console.error(err)
      )
    );

    if (!Object.keys(this.store.getState()).length) {
      const { id, isPrebidUser, userType, name, role, dashboardId, permissions } = await this.shared.getAndSaveUserData(this.currentUserId);
      this.store.assignState({
        id,
        isPrebidUser,
        userType,
        name,
        role,
        dashboardId,
        permissions
      });
      this.role = this.store.getState().role;
    }

    this.userType = this.store.getState().userType;
    this.isPrebidUser = this.store.getState().userType.includes('prebid');
    this.currentRoute = this.getCurrentRoute();
    this.role = this.store.getState().role;
    this.updateForm();
  }

  getCurrentRoute(): string {
    return this.router.routerState.snapshot.url.replace('/', '');
  }

  updateForm(): void {
    if (this.isPrebidUser === true) {
      this.form.controls.passbacktag.disable();
      this.form.controls.passbacktag.clearValidators();
      this.form.controls.floorPrice.clearValidators();
      this.form.controls.adUnitCode.enable();
      this.form.controls.networkId.setValidators([Validators.required, Validators.pattern(/([0-9]){5,20}/)]);
      this.form.controls.adUnitCode.setValidators([Validators.required]);
      this.form.updateValueAndValidity();
    } else {
      this.form.controls.adUnitCode.disable();
      this.form.controls.passbacktag.enable();
      this.form.controls.adUnitCode.clearValidators();
      this.form.controls.passbacktag.setValidators(Validators.required);
    }
    this.form.controls.name.disable();
    this.form.controls.name.setValue(this.currentUser);
    if (this.currentRoute.includes('configs')) {
      this.form.controls.domain.disable();
      this.form.controls.domain.setValue(this.currentDomain);
    }
    if (this.role === 'PUBLISHER') {
      this.form.controls.marketplace.disable();
    }

    this.form.updateValueAndValidity();
  }

  toggleToAll(checked: boolean, value: number | string): void {
    this.toAllState = { checked, value };
  }

  addPlacement(type: string): void {
    this.marketplace = this.form.get('marketplace').value;
    const settings = this.marketplace ?
      JSON.stringify(
        Object.assign(this.helpers.assignAdaptersSettings('main', 'add'), this.helpers.assignAdaptersSettings('marketplace', 'add'))
      )
      : JSON.stringify(this.helpers.assignAdaptersSettings('main', 'add'));
    this.form.get('adaptersList').setValue(this.marketplace ?
      JSON.stringify(Object.keys(JSON.parse(settings)))
      : JSON.stringify(this.adapters));
    const sizes = this.form.get('sizes').value.split('x');
    this.form.get('width').setValue(sizes[0]);
    this.form.get('height').setValue(sizes[1]);
    this.form.get('settings').setValue(settings);
    this.form.get('userId').setValue(this.currentUserId);
    this.form.controls.typeOfConfig.setValue(this.isPrebidUser ? 'prebid' : 'postbid');
    this.form.controls.name.enable();
    this.form.controls.domain.enable();
    if (type === 'config') {
      this.form.get('siteId').setValue(this.currentSiteId);
    }

    if (!this.form.get('cmpTimeout').value) {
      this.form.get('cmpTimeout').setValue('undefined');
    }

    if (this.analytics?.length > 0) {
      this.form.get('analyticsEnable').setValue(true);
      this.form.get('analytics').setValue(this.analytics);
    } else {
      this.form.get('analyticsEnable').setValue(false);
    }

    // check adWMG Analytics settings
    if (this.analytics?.length && this.analytics.includes('adWMG')) {
      const adWMGSettings = [];
      adWMGSettings[0] = {
        publisher_id: this.store.getState().dashboardId
      };

      adWMGSettings[1] = {
        site: this.shared.getClearDomain(this.form.controls.domain.value)
      };

      adWMGSettings[2] = {
        adUnitId: `${ this.form.controls.configname.value }_${ sizes[0] }x${ sizes[1] }`
      };
      if (!this.analyticsOptions) {
        this.analyticsOptions = {};
      }

      this.analyticsOptions.adWMG = adWMGSettings;
    }

    this.form.controls.analyticsOptions.setValue(this.analyticsOptions ? JSON.stringify(this.analyticsOptions) : JSON.stringify({}));

    let query = this.form.value;
    if (query?.typeOfConfig === 'prebid') {
      query.adUnitCode = `/${ query.networkId }/${ query.adUnitCode }`;
    } else {
      // no adUnit settings for postbid configs
      delete query.adUnitCode;
      delete query.networkId;
    }
    if (this.form.controls.schain.value === true) {
      query.schainObject = JSON.stringify({
        complete: this.form.get('schainComplete').value,
        ver: this.form.get('schainVer').value,
        nodes: this.form.get('schainNodes').value
      });
    }


    if (settings.includes('nodes')) {
      query.supplyChain = true;
    }

    if (query.currency === true) {
      query.currency = JSON.stringify({
        active: true,
        defaultCurrency: query.defaultCurrency
      });
    }

    if (this.marketplace === true) {
      query.marketplace = true;
      query.marketplaceSettings = JSON.stringify({
        enabled: true,
        adapters: Object.keys(this.helpers.assignAdaptersSettings('marketplace', 'add')),
        settings: this.helpers.assignAdaptersSettings('marketplace', 'add')
      });
    }
    if (this.existDomains?.includes(query.domain)) {
      this.subscriptions.add(this.translate
        .get('WBID.PROPERTIES.TABLE.DOMAIN_ALREADY_EXIST')
        .subscribe((message: string) => {
          this.form.controls.domain.setValue('');
          this.form.markAsTouched();
          this.form.updateValueAndValidity();
          this.formIsValid = this.form.valid;
          this.flashMessage.flash('error', message, 3500, 'center');
        }));
      return;
    }
    // query cleanup
    query = this.helpers.cleanRequestQuery(query);

    query.dev = this.dev;
    query.dashboardId = this.store.getState().dashboardId;
    if (this.dev) {
      const input: HTMLInputElement = document.querySelector('#adExId input');
      query.adExId = input.value;
    }
    this.store.assignState({
      query,
      route: this.form.controls.shortTag.value ? 'getShortTag' : 'addConfigToUser'
    });

    this.router.navigate(['wbid', 'tags']).catch((e) => console.error(e));
  }

  goBack(): void {
    this.location.back();
  }

  changeAdaptersList(adapters): void {
    this.adapters = adapters;
    this.form.get('adaptersList').setValue(JSON.stringify(this.adapters));
  }

  getMarketplaceSettings(event) {
    this.adapters = event.adapters;
    this.adapters.push('WMG Marketplace');
    this.form.get('adaptersList').setValue(JSON.stringify(this.adapters));
    this.marketplaceSettings = event.settings;
    this.marketplace = true;
  }

  changeAnalyticsList(analytics): void {
    this.analytics = analytics;
  }

  getOptions(analyticsOptions): void {
    this.analyticsOptions = analyticsOptions;
  }

  placementTypeToggle() {
    this.isPrebidUser = !this.isPrebidUser;
    this.store.assignState({
      placementType: this.isPrebidUser ? 'prebid' : 'postbid'
    });
    this.updateForm();
  }

  filterSlash(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    if (event && (event.key === '/' || event.key === ' ' || event.code === 'Space')) {
      target.value = target.value.replace(/(\s|\/)/g, '');
    }

    if (target.value?.length >= 34) {
      target.value = target.value.substr(0, 35);
      this.form.controls.configname.patchValue(target.value);
    }

    this.form.controls.configname.updateValueAndValidity();
  }

  filterOnFocusOut(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    if (event) {
      target.value = target.value.replace(/(\s|\/)/g, '');
      this.form.controls.configname.patchValue(target.value);
    }
    this.form.controls.configname.updateValueAndValidity();
  }

  checkTestValue(e) {
    this.dev = e.checked;
    if (e.checked === true) {
      this.form.controls.devForm.setValidators(Validators.required);
    } else {
      this.form.controls.devForm.clearValidators();
    }

    this.form.updateValueAndValidity();
  }

  public get cmpTypeBasic() {
    return this.form.get('cmpType').value === 'basic';
  }

  public get cmpTypeCustom() {
    return this.form.get('cmpType').value === 'custom';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
