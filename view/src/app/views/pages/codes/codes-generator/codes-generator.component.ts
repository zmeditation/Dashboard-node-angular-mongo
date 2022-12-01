import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { egretAnimations } from 'shared/animations/egret-animations';
import { Subscription } from 'rxjs';
import { ApiHttpService } from '../../reports/api-management/api-services/api-http.service';
import { CrudService } from '../../bidder/services/crud.service';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorFromServer, PublisherT, AdUnitQuery, AdUnitResponse } from '../../../../shared/interfaces/common.interface';
import { CodesGeneratorFormService } from './code-generator-forms.service';

@Component({
  selector: 'app-codes-generator',
  templateUrl: './codes-generator.component.html',
  styleUrls: ['./codes-generator.component.scss'],
  animations: egretAnimations
})
export class CodesGeneratorComponent implements OnInit, OnDestroy {

  allowedSizes: string[];

  codeTypes: string[] = ['GPT', 'Yandex'];

  isGenerated = false;

  code: string;

  isCopied = true;

  allPublishersList: string[] = [];

  filteredPublishers: string[];

  selectedPub: string;

  isFluidBanner: boolean;

  allPublishers: Array<PublisherT>;

  private subscriptions = new Subscription();

  constructor(
    private apiHttpService: ApiHttpService,
    private crudService: CrudService,
    private flashMessage: FlashMessagesService,
    private translate: TranslateService,
    public codeFormService: CodesGeneratorFormService
  ) {}

  ngOnInit() {
    this.getPublishers();
    this.getMetrics();
  }

  protected getPublishers(): void {
    const query = {
      findBy: ['PUBLISHER'],
      options: '_id name properties'
    };

    const pubsSub = this.apiHttpService.getPublishersApi(query)
      .subscribe(
        (data: { success: boolean; publishers: PublisherT[] }) => {
          if (data.success) {
            this.allPublishers = [...data.publishers].sort((prev, next) => {
              if (prev.name < next.name) { return -1; }
              if (prev.name < next.name) { return 1; }
            });

            for (const pub of this.allPublishers) { this.allPublishersList.push(pub.name); }

            this.filteredPublishers = this.allPublishersList;
          }
        },
        (error => console.error(error))
      );
    this.subscriptions.add(pubsSub);
  }

  protected getMetrics(): void {
    const metricsSub = this.crudService
      .getMetricsByRouteCode('tac', ['29012']) // AD TYPES, SIZES
      .subscribe((data) => {
        for (const res of data) {
          if (res.name === 'SIZES') { this.allowedSizes = res.results; }
        }
      });
    this.subscriptions.add(metricsSub);
  }

  public updatePubId(val): void {
    this.codeFormService.GPTCodesGenForm.controls.pub_id.disable();
    const selected = this.allPublishers.filter((pub) => pub.name === val);
    if (selected.length) {
      this.selectedPub = selected[0]._id;
      if (!this.codeFormService.GPTCodesGenForm.controls.pub_id.value) {
        this.codeFormService.GPTCodesGenForm.controls.pub_id.patchValue(this.selectedPub);
      }

      this.codeFormService.mainForm.controls.publisher.patchValue(selected[0].name);
    }
  }

  enablePubList(): void {
    this.codeFormService.mainForm.controls.publisher.enable();
  }

  private _filter(value): string[] {
    const filterValue = value.toLowerCase();
    return this.allPublishersList.filter((option) => option.toLowerCase().includes(filterValue));
  }

  public checkFormValidity(): boolean {
    return this.codeFormService.GPTCodesGenForm.valid
      && this.codeFormService.mainForm.controls.publisher.value.length > 0;
  }

  public filterPublishers(): void {
    this.filteredPublishers = this._filter(this.codeFormService.mainForm.controls.publisher.value);
  }

  async generateCode(): Promise<void> {
    try {
      if (this.codeFormService.mainForm.controls.is_new_adUnit.value === 'exist') {
        this.getTacCode();

      } else if (this.codeFormService.mainForm.controls.is_new_adUnit.value === 'new') {
        const adUnit = await this.createAdUnit();
        this.codeFormService.GPTCodesGenForm.controls.placement_id.patchValue(adUnit[0].adUnitCode);
        this.getTacCode();
      }

    } catch (e) {
      const error = this.GptErrorHandler(e);
      const showErrorSub = this.translate.get('CODES_PAGES.CODES_GEN.GPT_ERRORS.' + error)
        .subscribe((res) => {
          this.flashMessage.flash('error', res, 3000, 'center');
        });
      this.subscriptions.add(showErrorSub);
    }
  }

  protected getTacCode(): void {
    this.code = '';
    this.codeFormService.GPTCodesGenForm.enable();
    let sizes = this.codeFormService.GPTCodesGenForm.controls.sizes.value.split('x');
    sizes = sizes.map((size) => parseInt(size, 10));
    const query = this.codeFormService.GPTCodesGenForm.value;
    query.sizes = sizes;
    query.programmatic = 'Google Ad Manager';
    query.isFluid = this.isFluidBanner;
    if (query.isFluid) { query.fluidSettings = this.codeFormService.fluidSettings.value; }

    this.codeFormService.GPTCodesGenForm.controls.pub_id.disable();
    this.codeFormService.GPTCodesGenForm.controls.network_id.disable();
    this.codeFormService.GPTCodesGenForm.controls.analytics.disable();

    const addSub = this.crudService.addAnalytics(query)
      .subscribe(
        (data: { success: boolean; results: string }) => {
          this.isGenerated = data.success;
          this.isCopied = !data.success;

          if (this.isGenerated === false) {
            const genError = this.translate.get('CODES_PAGES.CODES_GEN.CODE_GENERATION_ERROR')
              .subscribe((res) => {
                this.flashMessage.flash('error', res, 3000, 'center');
              });
            this.subscriptions.add(genError);
          }

          this.code = data.results;
        },
        (error) => { throw error }
      );
    this.subscriptions.add(addSub);
  }

  protected createAdUnit(): Promise<any> {
    return new Promise((resolve, reject) => {
      const query = this.createAdUnitQuery();

      const createAdSub = this.crudService.createGptAdUnit(query)
        .subscribe(
          (data: AdUnitResponse) => { resolve(data?.data?.attributes.newUnit) },
          (error) => { reject(error) }
        );
      this.subscriptions.add(createAdSub);
    });
  }

  protected createAdUnitQuery(): AdUnitQuery {
    const sizes = this.codeFormService.GPTCodesGenForm.controls.sizes.value.split('x');
    return {
      adUnitParams: {
        configname: this.codeFormService.GPTCodesGenForm.controls.placement_id.value,
        size: {
          width: !!sizes[0] ? sizes[0] : 1,
          height: !!sizes[1] ? sizes[1] : 1
        },
        targetWindow: 'BLANK',
        environmentType: 'BROWSER',
        isFluid: this.isFluidBanner
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

  async copyHelper(value: string): Promise<void> {
    const copyhelper: HTMLTextAreaElement = document.createElement('textarea');
    copyhelper.className = 'copyhelper';
    document.body.appendChild(copyhelper);
    copyhelper.value = value;
    copyhelper.select();
    document.execCommand('copy');
    document.body.removeChild(copyhelper);
  }

  copy(): void {
    const textArea: HTMLTextAreaElement = document.querySelector('textarea#code-result-area');
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textArea.value)
        .then(() => (this.isCopied = true))
        .catch(console.error);
    } else {
      this.copyHelper(textArea.value)
        .then(() => (this.isCopied = true))
        .catch(console.error);
    }
  }

  public fluidHandler(event): void {
    this.isFluidBanner = event.checked;
    if (event.checked === true) {
      this.codeFormService.GPTCodesGenForm.controls.sizes.clearValidators();
      this.codeFormService.GPTCodesGenForm.controls.sizes.updateValueAndValidity();
      this.codeFormService.GPTCodesGenForm.controls.fluid_height.setValidators(Validators.required);
      this.codeFormService.GPTCodesGenForm.controls.fluid_height.updateValueAndValidity();
    } else {
      this.codeFormService.GPTCodesGenForm.controls.sizes.setValidators(Validators.required);
      this.codeFormService.GPTCodesGenForm.controls.sizes.updateValueAndValidity();
      this.codeFormService.GPTCodesGenForm.controls.fluid_height.clearValidators();
      this.codeFormService.GPTCodesGenForm.controls.fluid_height.updateValueAndValidity();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
