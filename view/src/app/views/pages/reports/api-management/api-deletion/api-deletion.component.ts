import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { egretAnimations } from 'shared/animations/egret-animations';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { AppTranslationService } from 'shared/services/translation/translation.service';
import { ApiHttpService } from '../api-services/api-http.service';
import { ApiDeletionDialogComponent } from './api-deletion-dialog/api-deletion-dialog.component';

interface APIDeletionQuery {
  programmatic: string;
  publisher: any;
  properties: any;
  dateFrom: string;
  dateTo: string;
}

interface Programmatic {
  name: string;
  value: string;
}

@Component({
  selector: 'app-api-deletion',
  templateUrl: './api-deletion.component.html',
  styleUrls: ['./api-deletion.component.scss'],
  animations: egretAnimations
})
export class ApiDeletionComponent implements OnInit, OnDestroy {
  query: APIDeletionQuery = {
    programmatic: '',
    publisher: [],
    properties: [],
    dateFrom: '',
    dateTo: ''
  };

  apiDeletionForm = new FormGroup({
    programmatic: new FormControl('', Validators.required),
    publisher: new FormControl([]),
    properties: new FormControl([]),
    dateFrom: new FormControl({ value: '', disabled: true }, Validators.required),
    dateTo: new FormControl({ value: '', disabled: true }, Validators.required)
  });

  filteredOptions: Observable<string[]>;

  filteredPublisher: Observable<any>;

  protected subscriptions: Subscription[] = [];

  programmaticsArray: Programmatic[] = [];

  publishersObject = {};

  publisherList: Array<any> = [];

  propertiesList: Array<any> = [];

  finishPropertiesList: Array<string> = [];

  selectedPublisher = {};

  isDateShow = true;

  unavailabilityRange = {
    max: new Date(),
    min: Infinity,
    maxFrom: null
  };

  constructor(
    protected apiHttpService: ApiHttpService,
    protected flashMessage: FlashMessagesService,
    public dialog: MatDialog,
    protected breakpointObserver: BreakpointObserver,
    protected translate: TranslateService,
    protected dateAdapter: DateAdapter<any>,
    protected appTranslation: AppTranslationService
  ) {
    this.handleDatepickerLang();
  }

  ngOnInit() {
    this.subscriptions.push(
      this.apiHttpService.getOrigins().subscribe((data) => {
        const { success, results } = data;
        if (success) {
          this.programmaticsArray = this.generateProgrammaticList(results);
        }
      })
    );

    this.getPublishers();
    this.filteredOptions = this.apiDeletionForm.get('properties').valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : '')),
      map((filter) => this._filter(filter))
    );

    this.filteredPublisher = this.apiDeletionForm.get('publisher').valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : '')),
      map((filter) => this._filterPublisher(filter))
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

  openDialog(): void {
    this.updateQuery();

    if (!this.isQueryValid()) {
      return this.flashMessage.flash('error', this.translate.instant('REPORT_MANAGEMENT_PAGE.API_MANAGEMENT.ERRORS.INVALID_FORM'), 3000);
    }

    const dialogRef = this.dialog.open(ApiDeletionDialogComponent, {
      width: '350px',
      data: { ...this.query }
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (!result) {
          return;
        }

        this.query.publisher = this.query.publisher._id;

        this.subscriptions.push(
          this.apiHttpService.removeAPIRecords(this.query).subscribe((data) => {
            if (data.success) {
              const status = data.status;
              if (parseInt(status, 10) > 0) {
                this.flashMessage.flash(
                  'success',
                  this.translate.instant('REPORT_MANAGEMENT_PAGE.API_MANAGEMENT.STATUSES.REPORTS_WERE_SUCCESSFULLY_DELETED', {
                    counter: status.split(' ')[0]
                  }),
                  3000
                );
              } else {
                this.flashMessage.flash('success', this.translate.instant('REPORT_MANAGEMENT_PAGE.API_MANAGEMENT.STATUSES.' + status), 3000);
              }
              this.getPublishers();

              this.publisherList = [];
              this.propertiesList = [];
              this.finishPropertiesList = [];
              this.selectedPublisher = {};

              this.apiDeletionForm.setValue({
                programmatic: '',
                publisher: [],
                properties: [],
                dateFrom: [],
                dateTo: []
              });

              this.apiDeletionForm.get('programmatic').setErrors(null);
              this.apiDeletionForm.markAsUntouched();
              this.apiDeletionForm.markAsPristine();
              this.apiDeletionForm.updateValueAndValidity();
            }
          })
        );
      })
    );
  }

  generateProgrammaticList(programmaticsArray): Programmatic[] {
    if (!programmaticsArray.length) {
      return [];
    }

    return programmaticsArray.map((programmatic) => {
      return {
        name: programmatic,
        value: programmatic
      };
    });
  }

  updateQuery(): void {
    const values = ['programmatic', 'publisher', 'properties', 'dateFrom', 'dateTo'];

    for (const value of values) {
      if (value === 'publisher') {
        this.query[value] = { ...this.selectedPublisher };
      } else {
        this.query[value] = this.apiDeletionForm.get(value).value;
      }
    }
  }

  get isMobile() {
    return this.breakpointObserver.isMatched('(max-width: 767px)');
  }

  isQueryValid(): boolean {
    const values = ['programmatic', 'dateFrom', 'dateTo'];

    for (const value of values) {
      if (!this.query[value]) {
        return false;
      }
    }

    return true;
  }

  requestPublisherList(programmatic): void {
    this.publisherList = [];
    this.propertiesList = [];
    this.apiDeletionForm.get('publisher').setValue([]);
    this.apiDeletionForm.get('properties').setValue([]);
    for (const value of Object.values(this.publishersObject)) {
      // @ts-ignore
      value.properties.forEach((publisher) => {
        if (publisher.property_origin === programmatic && !this.publisherList.includes(value)) {
          this.publisherList.push(value);
        }
      });
    }
    this.apiDeletionForm.get('publisher').setValue([]);
  }

  requestPropertiesList(publisher): void {
    this.selectedPublisher = { name: publisher.name, _id: publisher._id };
    const selectedOrigin = this.apiDeletionForm.get('programmatic').value;
    this.propertiesList = [];
    for (const value of publisher.properties) {
      if (value.property_origin === selectedOrigin) {
        this.propertiesList.push({
          property_id: value.property_id,
          selected: false
        });
      }
    }
    this.apiDeletionForm.get('properties').setValue([]);
  }

  getPublishers(): void {
    const query = {
      findBy: ['PUBLISHER'],
      options: '_id name properties.property_origin properties.property_id'
    };
    this.subscriptions.push(
      this.apiHttpService.getPublishersApi(query).subscribe((data) => {
        if (data.success) {
          this.publishersObject = { ...data.publishers };
        }
      })
    );
  }

  toggleSelection(prop) {
    prop.selected = !prop.selected;
    this.finishPropertiesList = this.propertiesList.map((el) => (el.selected ? el.property_id : undefined)).filter((el) => el !== undefined);
    this.apiDeletionForm.get('properties').setValue(this.finishPropertiesList);
  }

  optionClicked(event, property) {
    event.stopPropagation();
    this.toggleSelection(property);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.propertiesList.filter((option) => option.property_id.toLowerCase().includes(filterValue));
  }

  private _filterPublisher(value: string): any {
    const filterValue = value.toLowerCase();
    return this.publisherList.filter((option) => option.name.toLowerCase().includes(filterValue));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
