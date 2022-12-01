import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { ApiHttpService } from "../../reports/api-management/api-services/api-http.service";
import { Subscription } from "rxjs";
import { MatRadioChange } from "@angular/material/radio";
import { AdUnitQuery, ErrorFromServer, PublisherT } from "shared/interfaces/common.interface";
import { egretAnimations } from "shared/animations/egret-animations";
import { HttpErrorResponse } from "@angular/common/http";
import { CrudService } from "../../bidder/services/crud.service";
import { FlashMessagesService } from "shared/services/flash-messages.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-all-purpose-code-generator',
  templateUrl: './all-purpose-code-generator.component.html',
  styleUrls: ['./all-purpose-code-generator.component.scss'],
  animations: egretAnimations
})

export class AllPurposeCodeGeneratorComponent implements OnInit {

  public subscriptions: Subscription = new Subscription();

  public form: FormGroup;

  public adTypes: string[] = ['banner', 'in-banner-video', 'outstream'];

  public typeOfAd: string;

  public allPublishers: PublisherT[];

  public allPublishersList: string[] = [];

  public filteredPublishers: string[] = [];

  private selectedPub: string;

  public AdManagerRequestCounter = 0;

  public unitCompleted = false;

  public sizes: string[] = [
    'custom', '1x1', '88x31', '120x20', '120x30', '120x60', '120x90', '120x240', '120x600', '125x125',
    '160x600', '168x28', '168x42', '180x150', '200x200', '200x446', '216x36', '216x54', '220x90', '234x60',
    '240x133', '240x400', '250x250', '250x350', '250x400', '292x30', '300x31', '300x50', '300x75', '300x100', '300x250',
    '300x300', '300x600', '320x50', '320x100', '320x250', '320x320', '320x480', '336x280', '400x300', '468x60', '480x320', '510x340',
    '728x90', '768x1024', '970x90', '970x250', '1024x768', '100%x90', '100%x120', '100%x150', '100%x180', '100%x250'
  ];

  public position: string;

  public resizePositions: string[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];

  public selectedSizes = this.sizes;

  public code: string;

  public copied = false;

  public pack = false;

  public codesPack: Array<any> = [];

  public codePosition: string;

  public packedCode: string;

  private urlRegexp = /^((http|https|ftp|www):\/\/)([a-zA-Z0-9~!@#$%^&*()_\-=+\\\/?.:;',]*)(\.)([a-zA-Z0-9~!@#$%^&*()_\-=+\\\/?.:;',]+)/;

  public finalCode: string;

  public savedSettings = [];

  constructor(
    private apiHttpService: ApiHttpService,
    public crudService: CrudService,
    protected flashMessage: FlashMessagesService,
    protected translate: TranslateService,
    protected cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.getPublishers();
    this.checkPublishersValue();
  }

  protected buildForm(): void {
    this.form = new FormGroup({
      typeOfAd: new FormControl('', [Validators.required]),
      publisher: new FormControl('', [Validators.required]),
      publisherId: new FormControl({ value: '', disabled: false }, [Validators.required]),
      publisherNetworkId: new FormControl('', [Validators.required, Validators.pattern(/^\d{1,20}$/)]),
      pageUrl: new FormControl('', [Validators.pattern(this.urlRegexp)]),
      sizes: new FormControl(''),
      customHeight: new FormControl({ value: '', disabled: true }),
      customWidth: new FormControl({ value: '', disabled: true }),
      unitId: new FormControl('', [Validators.required, Validators.pattern(/^[\dA-z_\-.]{6,50}$/)]),
      wmgUnitId: new FormControl('', [Validators.pattern(/^[\dA-z_\-.]{6,50}$/)]),
      vastTag: new FormControl(''),
      vastTagSecond: new FormControl('', [Validators.pattern(this.urlRegexp)]),
      resizeOnScrollSize: new FormControl('400x300'),
      resizeOnScroll: new FormControl(''),
      fixed: new FormControl(false),
      adPosition: new FormControl(''),
      protectedMedia: new FormControl(false),
      noClose: new FormControl(false),
      sticky: new FormControl(false),
      stickyPosition: new FormControl('bottom'),
      fixedPosition: new FormControl('right'),
      fullscreen: new FormControl(false),
      refresh: new FormControl(true),
      refreshTime: new FormControl(30, [Validators.pattern(/^[1-9]\d{1,2}$/), Validators.min(30), Validators.max(999)])
    });
  }

  protected updateForm(): void {
    if (this.typeOfAd === 'outstream' || this.typeOfAd === 'in-banner-video') {
      this.form.controls.vastTag.setValidators([Validators.required, Validators.pattern(this.urlRegexp)]);
      this.form.controls.sizes.clearValidators();
      this.form.controls.sizes.setErrors(null);
    }

    if (this.typeOfAd === 'outstream') {
      this.form.controls.refresh.patchValue(false);
      this.form.controls.refresh.disable();
      this.form.controls.unitId.clearValidators();
      this.form.controls.unitId.setErrors(null);
    }

    if (this.typeOfAd === 'banner' || this.typeOfAd === 'in-banner-video') {
      this.form.controls.refresh.enable();
      this.form.controls.refresh.patchValue(true);
      this.form.controls.unitId.setValidators([Validators.required, Validators.pattern(/^[\dA-z_\-.]{6,50}$/)]);
      this.form.controls.unitId.markAsUntouched();
      this.form.controls.unitId.updateValueAndValidity();
    }

    if (this.typeOfAd === 'banner') {
      this.form.controls.vastTag.clearValidators();
      this.form.controls.vastTag.setErrors(null);
      this.form.controls.vastTag.updateValueAndValidity();
      this.form.controls.sizes.setValidators([Validators.required]);
      this.form.controls.sizes.updateValueAndValidity();
      this.form.controls.adPosition.patchValue('standard');
    }
    this.form.updateValueAndValidity();
  }

  resetFilterValue(): void {
    let searchField: HTMLInputElement = document.querySelector('input#search-field');
    searchField.value = '';
  }

  resetSizesList(event: boolean): void {
    if (event === false) {
      this.filterSizes('');
    }
  }

  checkPublishersValue(): void {
    this.subscriptions.add(
      this.form.controls.publisher.valueChanges.subscribe((data: string) => {
        if (!this.allPublishersList.includes(data)) {
          this.form.controls.publisher.setErrors(['incorrect pub']);
        }
      }));
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
              if (prev.name < next.name) {
                return -1;
              }
              if (prev.name < next.name) {
                return 1;
              }
            });
            for (const pub of this.allPublishers) {
              this.allPublishersList.push(pub.name);
            }
            this.filteredPublishers = this.allPublishersList;
          }
        },
        (error => console.error(error))
      );
    this.subscriptions.add(pubsSub);
  }

  public filterSizes(value: string): void {
    this.selectedSizes = this.search(value);
  }

  private search(value: string): string[] {
    let filter = value.toLowerCase();
    return this.sizes.filter(option => option.toLowerCase().startsWith(filter));
  }

  showNecessaryParams(typeOfAd: MatSelectChange): void {
    this.typeOfAd = typeOfAd.value;
    this.updateForm();
  }

  protected _filter(value): string[] {
    const filterValue = value.toLowerCase();
    return this.allPublishersList.filter((option) => option.toLowerCase().includes(filterValue));
  }

  public filterPublishers(): void {
    this.filteredPublishers = this._filter(this.form.controls.publisher.value);
  }

  public updatePubId(val): void {
    const selected = this.allPublishers.filter((pub) => pub.name === val);
    if (selected.length) {
      this.selectedPub = selected[0]._id;
      this.form.controls.publisherId.patchValue(this.selectedPub);
      this.form.controls.publisher.patchValue(selected[0].name);
    }
  }

  getSize(values): string {
    if (!values.sizes) {
      return '';
    }
    if (values.sizes && values.sizes !== 'custom') {
      return `size="${ values.sizes }"`;
    }
    if (values.sizes === 'custom') {
      return `size="${ values.customWidth }x${ values.customHeight }"`;
    }
    return '';
  }

  getRefresh(values): string {
    if (values.refresh && values.refreshTime === 30) {
      return 'refresh';
    }
    if (values.refresh && values.refreshTime !== 30) {
      return `refresh="${ values.refreshTime }"`;
    }
    return '';
  }

  getResizeOnScrollParams(values): string {
    if (values.typeOfAd === 'banner') {
      return '';
    }
    if (values.resizeOnScroll === '' || values.resizeOnScroll === 'no-resize') {
      return '';
    }

    if (values.adPosition !== 'resize-on-scroll') {
      return '';
    }

    return `resize-on-scroll="${ values.resizeOnScroll }" resize-on-scroll-size="${ values.resizeOnScrollSize }"`;
  }

  getVastTags(values): string {
    let result = '';
    if (values.typeOfAd === 'banner') {
      return result;
    }
    if (values.vastTag) {
      result = result.concat(` vast-tag="${ values.vastTag }" `);
    }
    if (values.vastTagSecond) {
      result = result.concat(` vast-tag-second="${ values.vastTagSecond }" `);
    }
    return result;
  }

  getStickyParams(values): string {
    return values.adPosition !== 'sticky' ? '' : (values.stickyPosition === 'top') ? `sticky="top"` : 'sticky';
  }

  getFixedParams(values): string {
    return values.adPosition !== 'fixed' ? '' : (values.fixedPosition === 'left') ? `fixed="left"` : 'fixed';
  }

  async prepareCode(form: FormGroup): Promise<void> {
    const values = form.value;
    this.copied = false;
    this.code = `<script
          class="adwmg"
          type-of-ad="${ values.typeOfAd }"
          pub-network-id="${ values.publisherNetworkId }"
          banner-unit="${ values.unitId }"
          wmg-pubid="${ values.publisherId }"
          ${ values.pageUrl ? 'page-url="' + values.pageUrl + '"' : '' }
          ${ this.getSize(values) }
          ${ values.protectedMedia ? 'protected-media' : '' }
          ${ this.getRefresh(values) }
          ${ values.adPosition !== 'resize-on-scroll' && values.adPosition !== 'standard' && values.adPosition !== 'sticky' && values.adPosition !== 'fixed'
      ? values.adPosition : '' }
          ${ this.getResizeOnScrollParams(values) }
          ${ this.getStickyParams(values) }
          ${ this.getFixedParams(values) }
          ${ this.getVastTags(values) }
          ${ values.wmgUnitId ? 'video-unit="' + values.wmgUnitId + '"' : '' }
          ${ values.noClose ? 'no-close' : '' }
          async
          src="https://d3f4nuq5dskrej.cloudfront.net/js/adwmg.min.js"
        ></script>
    `.trim().replace(/\s\s+/g, ' ');
  }

  checkCustomSizeValue(event: MatSelectChange): void {
    if (event.value && event.value === 'custom') {
      this.form.controls.customWidth.enable();
      this.form.controls.customHeight.enable();
      this.form.controls.customWidth.setValidators([
        Validators.required,
        Validators.pattern(/^\d{1,4}$|^100%$|^\(fill\)$/)
      ]);
      this.form.controls.customHeight.setValidators([
        Validators.required,
        Validators.pattern(/^\d{2,4}$/),
        Validators.max(2500),
        Validators.min(10)
      ]);
      this.form.controls.customWidth.updateValueAndValidity();
      this.form.controls.customHeight.updateValueAndValidity();
    } else {
      this.form.controls.customWidth.patchValue('');
      this.form.controls.customHeight.patchValue('');
      this.form.controls.customWidth.clearValidators();
      this.form.controls.customHeight.clearValidators();
      this.form.controls.customWidth.setErrors(null);
      this.form.controls.customHeight.setErrors(null);
      this.form.controls.customWidth.updateValueAndValidity();
      this.form.controls.customHeight.updateValueAndValidity();
      this.form.controls.customWidth.disable();
      this.form.controls.customHeight.disable();
    }
  }

  setResizePosition(event: MatRadioChange): void {
    this.position = event.value;
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

  async copy(): Promise<void> {
    const textArea: HTMLTextAreaElement = document.querySelector('textarea#code-result');
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textArea.value);
        this.copied = true;
        return;
      }
      await this.copyHelper(textArea.value);
      this.copied = true
    } catch (e) {
      console.error(e);
    }
  }

  test(): void {
    const baseUrl = 'https://wmgroup.us/testing/Valentin/test-short-tag?';
    const textArea: HTMLTextAreaElement = document.querySelector('textarea#code-result');
    const tag = textArea.value;
    const encodedTag = encodeURIComponent(tag);
    const params = new URLSearchParams();
    params.set('script', encodedTag);
    window.open(baseUrl + params.toString());
  }

  addToPack() {
    this.pack = true;
    this.codesPack.push({ script: this.code, params: this.form.value });
    this.code = "";
  }

  setCodePosition(event: MatSelectChange) {
    this.codePosition = event.value;
  }

  saveSettings(params: any) {
    let { index, position, articleClass, paragraphNumber, selector, placementId } = params;
    if (position === 'placementId' && !placementId) {
      placementId = `wmg-script-${ Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8) }`
    }
    if (paragraphNumber) {
      paragraphNumber = parseInt(paragraphNumber);
    }
    if (position) {
      position === 'inArticle' ? this.codesPack[index].inArticle = { articleClass, paragraphNumber } : '';
      position === 'afterElement' ? this.codesPack[index].afterElement = { selector } : '';
      position === 'placementId' ? this.codesPack[index].placementId = placementId : '';
    }

    if (position === 'placementId') { // add script id for selected code
      this.codesPack[index].script = this.codesPack[index].script.slice(0, 8) + `id="${ placementId }" ` + this.codesPack[index].script.slice(8);
    }

    this.savedSettings[index] = true;
  }

  sendPack() {
    this.packedCode = "";
    const pack = this.codesPack.map(el => Object.assign({}, el));
    for (let code of pack) {
      delete code.params;
    }

    this.crudService.getPackCode({
      codes: pack,
      publisher: this.form.controls.publisher.value,
      pub_id: this.form.controls.publisherId.value,
      type: pack.length > 1 ? 'pack' : 'single',
      site: this.extractHostname(this.form.controls.pageUrl.value)
    })
      .subscribe(result => {
        this.packedCode = result.code;
      });

  }

  async createNewUnit() {
    await this.sendAdUnitRequest();
  }

  public async sendAdUnitRequest(): Promise<void> {
    if (this.AdManagerRequestCounter === 0) {
      try {
        const unit = await this.createAdUnit();
        if (unit?.success) {
          this.unitCompleted = true;
          this.AdManagerRequestCounter++;
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

  getSizes(): { width: number, height: number } {
    let width, height;

    if (!this.form.controls.sizes.value) {
      width = 1;
      height = 1;
    }

    if (this.form.controls.sizes.value && this.form.controls.sizes.value !== "custom") {
      const sizes: string[] = this.form.controls.sizes.value.split('x');
      sizes[0] && sizes[0] !== '100%' ? width = parseInt(sizes[0]) : width = 1;
      height = parseInt(sizes[1]) || 1;
    }

    if (this.form.controls.sizes?.value === "custom") {
      width = this.form.controls.customWidth.value && this.form.controls.customWidth.value !== '100%' && this.form.controls.customWidth.value !== '(fill)'
        ? parseInt(this.form.controls.customWidth.value)
        : 1;
      height = parseInt(this.form.controls.customHeight.value) || 1;
    }

    return { width, height };
  }

  protected createAdUnitQuery(): AdUnitQuery {
    const { width, height } = this.getSizes();
    const configname = this.form.controls.unitId.value;
    return {
      adUnitParams: {
        configname,
        size: {
          width,
          height
        },
        targetWindow: 'BLANK',
        environmentType: 'BROWSER',
        isFluid: width === 1
      }
    };
  }

  extractHostname(url: string): string {
    let hostname;

    if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }

    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];

    return hostname;
  }

  protected GptErrorHandler(err: any): string {
    const errorAdUnit: ErrorFromServer = err?.error?.response;
    let stringError = 'OTHER';
    if (typeof errorAdUnit?.error === 'string' && errorAdUnit.error.includes('NOT_UNIQUE')) {
      stringError = 'NOT_UNIQUE';
    }
    return stringError;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
