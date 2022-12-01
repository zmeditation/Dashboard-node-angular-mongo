import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AllPurposeCodeGeneratorComponent } from "../all-purpose-code-generator/all-purpose-code-generator.component";
import { ApiHttpService } from "../../reports/api-management/api-services/api-http.service";
import { CrudService } from "../../bidder/services/crud.service";
import { FlashMessagesService } from "shared/services/flash-messages.service";
import { TranslateService } from "@ngx-translate/core";
import { FormControl } from "@angular/forms";

export type CodeObject = {
  code: string,
  articleClass: string,
  placementId: string,
  paragraphNumber: number,
  index: number,
  selector: string,
  position: any,
  id: number
}

export type CodeSettings = {
  script: string,
  placementId?: string,
  afterElement?: {
    selector: string
  },
  inArticle?: {
    articleClass: string,
    paragraphNumber: number
  }
}

export type CodeInDB = {
  createdAt: string,
  id: number,
  link: string,
  pub_id: string,
  settings: CodeSettings[],
  type: 'pack' | 'single',
  updatedAt: string
}

@Component({
  selector: 'app-codes-list',
  templateUrl: './codes-list.component.html',
  styleUrls: ['./codes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CodesListComponent extends AllPurposeCodeGeneratorComponent implements OnInit {

  public publisher = new FormControl();

  private currentPublisher;

  public userCodes: CodeInDB[];

  constructor(apiHttpService: ApiHttpService,
    crudService: CrudService,
    flashMessage: FlashMessagesService,
    translate: TranslateService,
    cdRef: ChangeDetectorRef) {
    super(apiHttpService, crudService, flashMessage, translate, cdRef);

  }

  ngOnInit(): void {
    this.getPublishers();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  public filterPublishers(): void {
    this.filteredPublishers = this._filter(this.publisher.value);
  }

  public updatePubId(val: string): void {
    const selected = this.allPublishers.filter((pub) => pub.name === val);
    if (selected.length) {
      this.currentPublisher = selected[0]._id;
    }

    this.crudService.getUserCodes(this.currentPublisher).subscribe(data => {
      this.userCodes = data;
      this.cdRef.detectChanges();
    })
  }

  getPosition(tag: CodeSettings): string {
    return tag['inArticle'] ? 'inArticle' : tag['afterElement'] ? 'afterElement' : tag['placementId'] ? 'placementId' : '';
  }

  saveThisTag(settings: CodeObject): void {
    let { position, code, index, id } = settings;
    for (let userCode of this.userCodes) {
      if (userCode.id === id) {
        let target: CodeSettings = { script: code };
        switch (position) {
          case 'placementId':
            target.placementId = settings.placementId;
            target.script = target.script.slice(0, 8) + `id="${ settings.placementId }" ` + target.script.slice(8);
            break;
          case 'inArticle':
            target.inArticle = {
              articleClass: settings.articleClass,
              paragraphNumber: settings.paragraphNumber
            }
            break;
          case 'afterElement':
            target.afterElement = {
              selector: settings.selector
            }
        }
        userCode.settings[index] = target;
      }
    }
  }

  updatePackOnCdn(index: number): void{
    const updateSub = this.crudService.updatePackCode({ code: this.userCodes[index] })
      .subscribe(result => {
        if (result.success) {
          this.flashMessage.flash('success', this.translate.instant('CODES_PAGES.UNIVERSAL_GENERATOR.PACK_UPDATED'), 3000, 'center')
        } else {
          this.flashMessage.flash('error', this.translate.instant('CODES_PAGES.UNIVERSAL_GENERATOR.PACK_UPDATE_ERROR'), 3000, 'center')
        }
      })

    this.subscriptions.add(updateSub);
  }

  deletePack(id: number, index: number): void {
    const delSub = this.crudService.deletePackCode(`id=${ id }`)
      .subscribe(result => {
        if (result.success) {
          this.userCodes.splice(index, 1);
          this.cdRef.detectChanges();
          this.flashMessage.flash('success', this.translate.instant('CODES_PAGES.UNIVERSAL_GENERATOR.PACK_DELETED'), 3000, 'center')
        } else {
          this.flashMessage.flash('error', this.translate.instant('CODES_PAGES.UNIVERSAL_GENERATOR.PACK_DELETE_ERROR'), 3000, 'center')
        }
      })

    this.subscriptions.add(delSub);
  }

  isHideSettings(tag: string) {
    return tag.includes('sticky') || tag.includes('fullscreen') || tag.includes('fixed');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.subscriptions.unsubscribe();
  }

}
