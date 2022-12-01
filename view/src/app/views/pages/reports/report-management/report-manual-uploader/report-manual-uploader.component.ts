/** @format */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { formatDate, LowerCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppTranslationService } from 'shared/services/translation/translation.service';
import { egretAnimations } from 'shared/animations/egret-animations';
import { ReportServiceDataService } from '../report-services/report-service-data.service';
import { ReportManualUploaderService } from '../report-services/report-manual-uploader.service';
import { ManualUploadBundleClasses } from './helpers/manual-upload-bundle-classes';

export interface Property {
  property: {
    domain: string;
    property_id: string;
    refs_to_user: string;
    am: string;
  };
  inventory: {
    sizes: string;
    width: number;
    height: number;
    inventory_type: string;
  };
  day: string;
  tags: string;
  ad_request: number;
  matched_request: number;
  clicks: number;
  ecpm: number;
  report_origin: string;
  publisher: {
    name: string;
    _id: string;
  };
}

export interface IGetInventoryParam {
  inventory_type: string;
  width: number;
  height: number;
}

export interface IInventory {
  sizes: string;
  width: number;
  height: number;
  inventory_type: string;
}

@Component({
  selector: 'app-report-manual-uploader',
  templateUrl: './report-manual-uploader.component.html',
  styleUrls: ['./report-manual-uploader.component.scss'],
  animations: egretAnimations
})
export class ReportManualUploaderComponent extends ManualUploadBundleClasses implements OnInit, OnDestroy {
  public uploadFormManual: FormGroup;

  private lowercase = new LowerCasePipe();

  public rows: Property[] = [];

  filteredPublishers: Observable<string[]>;

  filteredDomains: Observable<string[]>;

  filteredProperty: Observable<string[]>;

  filteredProgrammatics: Observable<string[]>;

  protected subscriptions: Subscription[] = [];

  constructor(
    public reportManualUploaderService: ReportManualUploaderService,
    private reportServiceDataService: ReportServiceDataService,
    public _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    protected appTranslation: AppTranslationService,
    protected dateAdapter: DateAdapter<any>
  ) {
    super(_formBuilder, reportManualUploaderService, snackBar);

    this.handleDatepickerLang();
  }

  ngOnInit() {
    this.creatForm();
    this.searchForPublisher();
    // Do searchForPublisher, when reset form
    this.subscriptions.push(
      this.uploadFormManual.get('publisher').valueChanges.subscribe((pub) => {
        pub === null && this.searchForPublisher();
        if (!pub || typeof pub === 'string') {
          this.domains = [];
          this.uploadFormManual.get('domain').setValue('');
          this.uploadFormManual.get('domain').markAsUntouched();
        }
      })
    );
  }

  protected handleDatepickerLang() {
    this.dateAdapter.setLocale(this.appTranslation.lang);

    this.subscriptions.push(
      this.appTranslation.langSubject.subscribe((lang: string) => {
        this.dateAdapter.setLocale(lang);
      })
    );
  }

  // Сохранение данных из формы в таблицу, компонент report-manual-uploader-table

  public uploadRow(formDirective: FormGroupDirective) {
    const defaultInventorySizes = {
      width: 0,
      height: 0
    };
    const {
      domain,
      publisher,
      inventory_sizes = defaultInventorySizes,
      inventory_type,
      day: fullDate,
      clicks,
      ad_request,
      matched_request,
      ecpm,
      report_origin,
      tags
    } = this.uploadFormManual.value;

    const shortDate = formatDate(fullDate, 'yyyy-MM-dd', 'en-US');

    const getInventoryParam: IGetInventoryParam = {
      inventory_type,
      width: parseInt(inventory_sizes.width, 10),
      height: parseInt(inventory_sizes.height, 10)
    };

    const newRow: Property = {
      property: {
        domain,
        property_id: tags,
        refs_to_user: this.bundleObjectProgDomPlace._id,
        am: this.bundleObjectProgDomPlace.am
      },
      inventory: ReportManualUploaderComponent.getInventorySizeByType(getInventoryParam),
      clicks,
      ad_request,
      matched_request,
      day: shortDate,
      ecpm,
      report_origin,
      tags,
      publisher
    };

    this.rows.unshift(newRow);

    this.reportServiceDataService.sendProperty(this.rows);
    formDirective.resetForm();
  }

  private static getInventorySizeByType(params: IGetInventoryParam): IInventory {
    const { inventory_type, width, height } = params;
    const selectObject = {
      banner: {
        sizes: `${ width }x${ height }`,
        width,
        height,
        inventory_type: 'banner'
      },
      video: {
        sizes: 'Video/Overlay',
        width,
        height,
        inventory_type: 'video'
      }
    };

    return selectObject[inventory_type];
  }

  // Фильтры для поиска в полях паблишер, программатик, домен, плейсмент

  searchForPublisher() {
    this.filteredPublishers = this.uploadFormManual.get('publisher').valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_publishers(value))
    );
  }

  searchForProgrammatics() {
    this.filteredProgrammatics = this.uploadFormManual.get('report_origin').valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_programmatics(value))
    );
  }

  searchForDomain() {
    this.filteredDomains = this.uploadFormManual.get('domain').valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_domains(value))
    );
  }

  searchForProperty() {
    this.filteredProperty = this.uploadFormManual.get('tags').valueChanges.pipe(
      startWith(''),
      map((value) => this._filter_properties(value))
    );
  }

  // Проверка типа инвентаря для отключения или включения инпутов для ввода размеров (ширины и высоты)
  checkingInventoryType() {
    if (this.uploadFormManual.get('inventory_type').value === 'video') {
      this.uploadFormManual.get('inventory_sizes').disable();
    } else {
      this.uploadFormManual.get('inventory_sizes').enable();
    }
  }

  displayFn(value) {
    return value ? value.name : undefined;
  }

  public _filter_publishers(value) {
    if (value !== null && value !== undefined) {
      // Выбираем все программатики введенного паблишера (value)

      if (this.uploadFormManual.get('publisher').valid) {
        this.domains = [];
        this.originsOfPublisher = [];
        this.properties = [];
        this.uploadFormManual.get('report_origin').setValue('');
        this.allPropertiesServerObject.some((i) => {
          if (i._id === value._id) {
            return (this.bundleObjectProgDomPlace = {
              programmatics: i.programmatics,
              domains: i.domains,
              properties: i.properties,
              _id: i._id,
              am: i.am
            });
          }
        });
        this.originsOfPublisher = this.bundleObjectProgDomPlace.programmatics;
        this.domains = this.bundleObjectProgDomPlace.domains;
        this.uploadFormManual.get('report_origin').setValidators([this.validatorForProgrammatics(this.originsOfPublisher)]);
        this.uploadFormManual.get('domain').setValidators([this.validatorForDomains(this.domains)]);
        if (this.originsOfPublisher.length === 0 || this.domains.length === 0) {
          this.openSnackBar('No properties. Please, add new properties for publisher.', 'X');
        }
      }
      this.searchForDomain();
      this.searchForProgrammatics();

      if (typeof value === 'string' || value === '') {
        const filterValue = value.toLowerCase();
        return this.publishers.filter((pub) => pub.name.toLowerCase().includes(filterValue));
      }
      return this.publishers.filter((pub) => pub.name.toLowerCase().includes(value));
    }
  }

  private _filter_programmatics(value) {
    if (value !== null && value !== undefined) {
      // Выбираем все юниты согласно выбранным паблишера и программатика (value)

      if (this.uploadFormManual.get('report_origin').valid) {
        this.properties = [];
        this.uploadFormManual.get('tags').setValue('');
        this.uploadFormManual.get('domain').setValue('');
        this.properties = this.bundleObjectProgDomPlace.properties[value] ? this.bundleObjectProgDomPlace.properties[value] : [];
      }
      this.searchForProperty();
      const filterValue = value.toLowerCase();
      this.uploadFormManual.get('tags').setValidators([this.validatorForPlacements(this.properties)]);
      return this.originsOfPublisher.filter((prog) => prog.toLowerCase().includes(filterValue));
    }
  }

  private _filter_domains(value: string): string[] {
    if (value !== null && value !== undefined) {
      const filterValue = this.lowercase.transform(value);
      return this.domains.filter((dom) => dom.toLowerCase().includes(filterValue));
    }
  }

  private _filter_properties(value: string): string[] {
    if (value !== null && value !== undefined && this.properties !== undefined) {
      if (typeof value === 'string' || value === '') {
        const filterValue = value.toLowerCase();
        return this.properties.filter((pl) => pl.toLowerCase().includes(filterValue));
      }
      return this.properties.filter((pl) => pl.toLowerCase().includes(value));
    }
  }

  ngOnDestroy() {
    if (this.mySubscriptionOnProperties !== undefined) {
      this.mySubscriptionOnProperties.unsubscribe();
    }
    if (this.mySubscriptionOnOrigins !== undefined) {
      this.mySubscriptionOnOrigins.unsubscribe();
    }

    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
