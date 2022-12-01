import moment from 'moment';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { FileLikeObject, FileUploader } from 'ng2-file-upload';
import { FileItem } from 'ng2-file-upload/file-upload/file-item.class';
import { catchError } from 'rxjs/operators';
import { SatDatepicker, DateAdapter } from 'saturn-datepicker';
import { EMPTY, Subscription } from 'rxjs';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { IInvoice } from 'shared/interfaces/invoice.interface';
import { Invoice, Publisher } from 'shared/interfaces/common.interface';
import { JPEG, PDF, PNG, XLSX } from 'shared/constants/mime-types';
import { CrudService } from 'shared/services/cruds/crud.service';
import { AppTranslationService } from 'shared/services/translation/translation.service';
import { FILTER_IDS } from '../../../../wmg_modules/statistics/main-filter/filter-request-services/filter-request-ids';
import { FilterRequestService } from '../../../../wmg_modules/statistics/main-filter/filter-request-services/filter-request.service';
import { environment } from '../../../../../environments/environment';

const SNACKBAR_LIFETIME = 10000;

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit, OnChanges, OnDestroy {
  @Input() invoices: Invoice[];

  @Output() uploaded = new EventEmitter();

  protected subscriptions: Subscription = new Subscription();

  invoiceList: Set<string>;

  public readonly uploader: FileUploader;

  public readonly loadedFiles = new Map<FileItem, IInvoice>();

  public pubsFilter: FormControl = new FormControl();

  public filteredPubs: ReplaySubject<Publisher[]> = new ReplaySubject<Publisher[]>(1);

  invoiceDateRange = new FormControl();

  publishersListControl = new FormControl();

  begin: moment.Moment;

  end: moment.Moment;

  maxDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  minDate = new Date(new Date().getFullYear() - 3, 0, 1);

  publishersList: Publisher[];

  targetedPublisher: Publisher;

  constructor(
    protected snackBar: MatSnackBar,
    protected translate: TranslateService,
    protected crudService: CrudService,
    public filterRequestService: FilterRequestService,
    protected dateAdapter: DateAdapter<any>,
    protected appTranslation: AppTranslationService
  ) {
    const options = {
      allowedMimeType: [PDF, PNG, JPEG],
      url: environment.apiURL + '/invoice/create',
      method: 'post',
      maxFileSize: 5 * Math.pow(2, 20),
      authTokenHeader: 'Authorization',
      queueLimit: 10,
      autoUpload: true,
      authToken: localStorage.getItem('currentUser')
    };
    this.uploader = new FileUploader(options);

    this.uploader.onSuccessItem = (item: FileItem, response: string) => {
      const data = JSON.parse(response).result;
      this.loadedFiles.set(item, data);
      this.uploaded.emit({ success: true, file: item.file.name });
      this.uploader.clearQueue();
    };

    // check if filename already exist in array of invoices
    this.uploader.onAfterAddingFile = (item) => {
      if (this.invoiceList.has(item.file.name)) {
        this.showError(
          this.translate.instant('INVOICES.ERRORS.ALREADY_EXIST', {
            file: item.file.name
          })
        );
        this.clearFileFromList(this.uploader, item);
      }
    };

    // if file upload error comes from backend
    this.uploader.onErrorItem = (item, res, status) => {
      if (status === 422) {
        this.showError(
          this.translate.instant('INVOICES.ERRORS.ALREADY_EXIST', {
            file: item.file.name
          })
        );
        this.uploader.removeFromQueue(item);
      } else {
        this.showError(
          this.translate.instant('INVOICES.ERRORS.UNKNOWN_ERROR', {
            error: JSON.parse(res).msg
          })
        );
      }
    };

    this.uploader.onWhenAddingFileFailed = (item, filter) => this.onWhenAddingFileFailed(item, filter);
    this.handleDatepickerLang();
  }

  public ngOnInit(): void {
    const publishersSub = this.filterRequestService.getFilterResultsById(FILTER_IDS.PUBLISHER).subscribe((data) => {
      this.publishersList = data.results;
      this.filteredPubs.next(this.publishersList.slice());
    });
    this.subscriptions.add(publishersSub);

    const pubsFilterSub = this.pubsFilter.valueChanges.subscribe(() => {
      this.filterPubs();
    });
    this.subscriptions.add(pubsFilterSub);

    const pubsValueChangesSub = this.publishersListControl.valueChanges.subscribe((pub: Publisher) => {
      this.targetedPublisher = pub;
    });
    this.subscriptions.add(pubsValueChangesSub);

    // override onBuildItemForm method to send custom form data
    this.uploader.onBuildItemForm = (fileItem: FileItem, form: FormData) => {
      form.append('begin', this.begin.toISOString());
      form.append('end', this.end.toISOString());
      if (this.targetedPublisher) {
        // if invoice uploaded for custom publisher, set its id
        form.append('publisher', this.targetedPublisher.id);
      }
    };

    const invoicesValueChangesSub = this.invoiceDateRange.valueChanges.subscribe((changes) => {
      // set date to non-timezoned units
      if (changes && changes.begin && changes.end) {
        this.begin = moment(changes.begin.toDate()).subtract(changes.begin.toDate().getTimezoneOffset(), 'minutes');
        this.end = moment(changes.end.toDate()).subtract(changes.end.toDate().getTimezoneOffset(), 'minutes');
      }
    });
    this.subscriptions.add(invoicesValueChangesSub);
  }

  protected handleDatepickerLang() {
    this.dateAdapter.setLocale(this.appTranslation.lang);

    this.subscriptions.add(
      this.appTranslation.langSubject.subscribe((lang: string) => {
        this.dateAdapter.setLocale(lang);
      })
    );
  }

  public loadExample(): void {
    const loadExampleSub = this.crudService.loadExample().subscribe((response) => {
      const blob = new Blob([response], { type: XLSX });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'wmg-invoice-example';
      a.click();
      a.remove();
    });

    this.subscriptions.add(loadExampleSub);
  }

  public removeInvoice(file: FileItem): void {
    if (!this.loadedFiles.has(file)) {
      this.showError('You try to remove unloaded file');
    }

    this.uploader.removeFromQueue(file);
    const invoice = this.loadedFiles.get(file);
    this.loadedFiles.delete(file);

    const deleteInvoiceSub = this.crudService
      .deleteInvoice(invoice._id)
      .pipe(
        catchError(() => {
          const text = this.translate.instant('SERVER_BUSY');
          this.showError(text);
          return EMPTY;
        })
      )
      .subscribe();

    this.subscriptions.add(deleteInvoiceSub);
  }

  public showError(message: string): void {
    this.snackBar.open(message, 'OK', {
      panelClass: 'warn',
      duration: SNACKBAR_LIFETIME
    });
  }

  onWhenAddingFileFailed(item: FileLikeObject, filter: any) {
    switch (filter.name) {
      case 'fileSize':
        this.showError(
          this.translate.instant('INVOICES.ERRORS.TOO_BIG', {
            size: (item.size / Math.pow(2, 20)).toFixed(2),
            limit: 5
          })
        );
        break;
      case 'mimeType':
        const allowedTypes = ['PDF', 'PNG', 'JPEG'].join(' ');
        this.showError(
          this.translate.instant('INVOICES.ERRORS.INCORRECT_FILE_TYPE', {
            type: item.type,
            types: allowedTypes
          })
        );
        break;
      default:
        this.showError(
          this.translate.instant('INVOICES.ERRORS.UNKNOWN_ERROR', {
            error: filter.name
          })
        );
    }
  }

  clearFileFromList(uploader: FileUploader, item: FileItem) {
    uploader.removeFromQueue(item);
  }

  onMonthSelected(event: moment.Moment, dp: SatDatepicker<any>, dateRange: HTMLInputElement) {
    const targetDate = event.toDate();
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth() + 1;
    this.invoiceDateRange.patchValue({
      begin: targetDate,
      end: new Date(targetYear, targetMonth, 0)
    });
    dp.close();
  }

  private filterPubs(): void {
    if (!this.publishersList) {
      return;
    }

    let search = this.pubsFilter.value;
    if (!search) {
      this.filteredPubs.next(this.publishersList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredPubs.next(this.publishersList.filter((pub) => pub.name.toLowerCase().indexOf(search) > -1));
  }

  cancelFileUpload() {
    this.uploader.clearQueue();
  }

  _reset(e: Event) {
    this.publishersListControl.patchValue('');
    e.stopPropagation();
  }

  onFileClick(event) {
    event.target.value = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.invoices) {
      this.invoiceList = new Set(changes.invoices.currentValue.map((i) => i.name));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
