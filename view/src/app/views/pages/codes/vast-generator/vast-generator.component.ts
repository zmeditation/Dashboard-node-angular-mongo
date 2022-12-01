import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { IAdUnit } from './interfaces/ad-unit';
import { defaultAdUnit, defaultVastUrlParams } from './data/vast-generator-default-data';
import { IVastUrlParams } from './interfaces/vast-url-params';
import { AdsDisplaySizesEnum } from './enums/ads-display-sizes.enum';
import { getLabel } from './data/labels';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { errorList } from 'shared/directives/control-error.directive/error-list';
import { MatCheckboxChange } from '@angular/material/checkbox/checkbox';
import { AdUnitQuery, AdUnitResponse, ErrorFromServer } from "shared/interfaces/common.interface";
import { CrudService } from "../../bidder/services/crud.service";
import { FlashMessagesService } from "shared/services/flash-messages.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-vast-generator',
  templateUrl: './vast-generator.component.html',
  styleUrls: ['./vast-generator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VastGeneratorComponent implements OnInit, OnDestroy {
  public form!: FormGroup;

  public resultUrl = environment.vastEndpoint;

  private durationChangeSubscription = new Subscription();

  public readonly sizes: string[] = Object.values(AdsDisplaySizesEnum);

  private readonly subscription = new Subscription();

  public AdManagerRequestCounter: number = 0;

  protected isNewUnit = false;

  /** controls */
  private skipOffsetControl = new FormControl(defaultVastUrlParams.skipOffset, [Validators.min(1), Validators.max(59)]);

  private duration = new FormControl(defaultVastUrlParams.duration, [Validators.min(1), Validators.max(30)]);

  /** pass to template */
  public readonly getLabel = getLabel;
  public unitCompleted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private flashMessage: FlashMessagesService,
    private crudService: CrudService
  ) {
  }

  public ngOnInit(): void {
    const showSkipButton = new FormControl(defaultVastUrlParams.showSkipButton);
    const newAdUnit = new FormControl(defaultVastUrlParams.newAdUnit);
    this.form = new FormGroup({
      networkId: new FormControl({ value: defaultAdUnit.networkId, disabled: true }, [Validators.required]),
      childNetworkId: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{6,50}$/)]),
      adUnitCode: new FormControl(defaultAdUnit.adUnitCode, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      duration: this.duration,
      pageUrl: new FormControl(defaultVastUrlParams.pageUrl, [Validators.required]),
      skipOffset: this.skipOffsetControl,
      newAdUnit,
      showSkipButton
    });

    const subscriber = showSkipButton.valueChanges.subscribe((isShow: boolean) => {
      if (isShow) {
        this.skipOffsetControl.enable();
      } else {
        this.skipOffsetControl.disable();
      }

    });
    this.subscription.add(subscriber);
    const subscription = this.form.valueChanges.pipe(debounceTime(300))
      .subscribe(() => this.generateUrl(this.form.getRawValue()));
    this.subscription.add(subscription);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.durationChangeSubscription.unsubscribe();
  }

  public checkboxChecked(event: MatCheckboxChange): void {
    if (event.checked) {
      return this.durationChangeSubscription.unsubscribe();
    }

    if (!event.checked) {
      this.skipOffsetControl.setValue(this.duration.value);
      this.durationChangeSubscription.unsubscribe();
      this.durationChangeSubscription = this.duration.valueChanges
        .subscribe((value) => this.skipOffsetControl.setValue(value));
    }
  }

  public copyUrl(url: string): void {
    this.clipboard.copy(url);
    const text: string = this.translate.instant('PROFILE_PAGE.API_ACCESS.COPIED');
    this.snackBar.open(text, undefined, { duration: 500 });
  }

  public showValidationWarning(): void {
    if (!this.form || this.form.valid) {
      return;
    }

    const errors: string[] = [];
    Object.entries(this.form.controls)
      .filter(([, control]) => control.invalid)
      .forEach(([field, control]) => {
        const label = getLabel(field);
        const fieldText = label ? this.translate.instant(getLabel(field)) : field;
        Object.entries(control.errors)
          .filter(([errorType]) => errorList[errorType])
          .forEach(([errorType, params]) => {
            const errorText = errorList[errorType];
            const text = this.translate.instant(errorText, params);
            errors.push(`${ fieldText }: ${ text }`);
          });
      });
    this.snackBar.open(errors.join('\n'), undefined, {
      panelClass: 'warn',
      duration: 3000
    });
  }

  public async newAdUnitCheck(event: MatCheckboxChange) {
    this.isNewUnit = event.checked;
    this.unitCompleted = !event.checked;
  }

  public async sendAdUnitRequest(): Promise<void> {
    if (this.isNewUnit && this.AdManagerRequestCounter === 0) {
      try {
        const unit = await this.createAdUnit();
        if (unit?.success) {
          this.unitCompleted = true;
          this.AdManagerRequestCounter++;
          this.form.controls.adUnitCode.disable();
        }
      } catch (e) {
        const error = this.GptErrorHandler(e);
        this.flashMessage.flash('error', this.translate.instant('CODES_PAGES.CODES_GEN.GPT_ERRORS.' + error), 3000, 'center');
      }
    }
    this.form.setErrors(null);
    this.form.markAsUntouched();
  }

  protected async createAdUnit(): Promise<{ success: boolean, result: string | undefined, error: HttpErrorResponse | null } | never> {
    const query = this.createAdUnitQuery();
    const res = await this.crudService.createGptAdUnit(query).toPromise();
    if (res.error) {
      return {
        success: false,
        result: undefined,
        error: res.error
      }
    }

    return {
      success: true,
      result: res?.data?.attributes.newUnit,
      error: null
    }
  }

  protected createAdUnitQuery(): AdUnitQuery {
    return {
      adUnitParams: {
        configname: this.form.controls.adUnitCode.value,
        size: {
          width: 1,
          height: 1
        },
        targetWindow: 'BLANK',
        environmentType: 'BROWSER',
        isFluid: false
      }
    };
  }

  protected GptErrorHandler(err: any): string {
    const errorAdUnit: ErrorFromServer = err?.error?.response;
    let stringError = 'OTHER';
    if (typeof errorAdUnit?.error === 'string' && errorAdUnit.error.includes('NOT_UNIQUE')) {
      stringError = 'NOT_UNIQUE';
    }
    return stringError;
  }

  public generateUrl(values: Omit<IAdUnit & IVastUrlParams, 'adSlotSize'>): void {
    if (!this.form || !this.form.valid) {
      return;
    }

    const url = new URL(environment.vastEndpoint);
    if (values.networkId === undefined) {
      values.networkId = this.form.controls.networkId.value;
    }

    Object.entries({
      ...values,
      networkId: this.form.controls.networkId.value.concat(',').concat(this.form.controls.childNetworkId.value)
    }).forEach(([field, value]) => {
      if (value === '' || value === null || field === 'showSkipButton' || field === 'childNetworkId') {
        return;
      }
      url.searchParams.append(field, value);
    });
    url.searchParams.append('adSlotSize', defaultAdUnit.adSlotSize);
    this.resultUrl = url.href.replace('%2C', ',');
  }
}
