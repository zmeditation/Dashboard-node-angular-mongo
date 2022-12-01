import moment from 'moment';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from 'saturn-datepicker';
import { NgxPermissionsService } from 'ngx-permissions';
import { ReplaySubject, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Publisher, Manager, Invoice } from 'shared/interfaces/common.interface';
import { EventCollectorService } from 'shared/services/event-collector/event-collector.service';
import { User } from 'shared/interfaces/users.interface';
import { INVOICE_STATUS } from 'shared/interfaces/invoice.interface';
import { CrudService } from 'shared/services/cruds/crud.service';
import { AppTranslationService } from 'shared/services/translation/translation.service';
import { FilterRequestService } from '../../../../../wmg_modules/statistics/main-filter/filter-request-services/filter-request.service';
import { FILTER_IDS } from '../../../../../wmg_modules/statistics/main-filter/filter-request-services/filter-request-ids';

@Component({
  selector: 'app-invoices-table-filter',
  templateUrl: './invoices-table-filter.component.html',
  styleUrls: ['./invoices-table-filter.component.scss']
})
export class InvoicesTableFilterComponent implements OnInit, OnChanges, OnDestroy {
  protected subscriptions: Subscription = new Subscription();

  invoicesForm = new FormGroup({
    period: new FormControl('', [Validators.required]),
    publishers: new FormControl(''),
    managers: new FormControl('')
  });

  publishersList: Publisher[];

  managersList: Manager[];

  statuses = Object.values(INVOICE_STATUS);

  invoices: Invoice[] = [];

  user: User;

  managersInterface = {};

  public pubsFilter: FormControl = new FormControl();

  public filteredPubs: ReplaySubject<Publisher[]> = new ReplaySubject<Publisher[]>(1);

  public managersFilter: FormControl = new FormControl();

  public filteredManagers: ReplaySubject<Manager[]> = new ReplaySubject<Manager[]>(1);

  @Output() currentInvoices = new EventEmitter();

  @Output() isLoaded = new EventEmitter();

  @Input() updateInvoicesList: { success: boolean; file: string };

  constructor(
    public filterRequestService: FilterRequestService,
    private crudService: CrudService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    public event: EventCollectorService,
    public permissionsService: NgxPermissionsService,
    protected dateAdapter: DateAdapter<any>,
    protected appTranslation: AppTranslationService
  ) {
    this.handleDatepickerLang();
  }

  ngOnInit(): void {
    this.currentInvoices.emit([]);

    const publishersSub = this.filterRequestService
      .getFilterResultsById(FILTER_IDS.PUBLISHER)
      .subscribe((data: { success: boolean; name: string; results: Publisher[] }) => {
        this.publishersList = data.results;
        this.filteredPubs.next(this.publishersList.slice());
      })
    this.subscriptions.add(publishersSub);

    const managersSub = this.filterRequestService
      .getFilterResultsById(FILTER_IDS.MANAGERS)
      .subscribe((data: { success: boolean; name: string; results: Manager[] }) => {
        this.managersList = data.results;
        this.filteredManagers.next(this.managersList.slice());
        this.managersList.forEach((m) => (this.managersInterface[m._id] = m.manager));
      })

    this.subscriptions.add(managersSub);

    this.subscriptions.add(
      this.pubsFilter.valueChanges.subscribe(() => {
        this.filterPubs();
      })
    );

    this.subscriptions.add(
      this.managersFilter.valueChanges.subscribe(() => {
        this.filterManagers();
      })
    );

    const checkPermissionsSub = this.event.managedUserInfo$.subscribe((user: User) => {
      this.user = user;
      if (
        typeof this.permissionsService.getPermissions() === 'object' &&
        Object.keys(this.permissionsService.getPermissions()).includes('canUploadInvoices')
      ) {
        this.getAllInvoices(user);
      }
    })

    this.subscriptions.add(checkPermissionsSub);
  }

  protected handleDatepickerLang() {
    this.dateAdapter.setLocale(this.appTranslation.lang);

    this.subscriptions.add(
      this.appTranslation.langSubject.subscribe((lang: string) => {
        this.dateAdapter.setLocale(lang);
      })
    );
  }

  public showError(message: string): void {
    this.snackBar.open(message, 'OK', { panelClass: 'warn', duration: 3000 });
  }

  getInvoices(): void {
    this.currentInvoices.emit([]);
    this.isLoaded.emit(true);

    const getInvoicesSub = this.crudService
      .getInvoices(this.prepareReqData(this.invoicesForm.value))
      .pipe(
        // @ts-ignore
        catchError((err) => {
          this.showError(this.translate.instant(`INVOICES.ERRORS.${ err.error.msg }`));
        })
      )
      .subscribe((data: Invoice[] | null) => {
        if (!data) {
          this.showError(this.translate.instant(`INVOICES.ERRORS.NO_INVOICES`));
          this.currentInvoices.emit([]);
          this.isLoaded.emit(false);
          return (this.invoices = []);
        }
        this.invoices = this.processInvoicesData(data);
        this.currentInvoices.emit(this.invoices);
        this.isLoaded.emit(false);
      })

    this.subscriptions.add(getInvoicesSub);
  }

  processInvoicesData(invoices: Invoice[]): Invoice[] {
    return invoices.map((invoice) => {
      if (invoice.publisher) {
        invoice.publisher.am = this.managersInterface[invoice.publisher.am];
        return invoice;
      }
    })
      .filter(invoice => invoice?.publisher?.enabled?.status === true); // show invoice in the table only if publisher enabled
  }

  prepareReqData(form) {
    const period = {
      begin: moment(form.period.begin).format('YYYY-MM-DD'),
      end: moment(form.period.end).add(1, 'days').format('YYYY-MM-DD')
    };
    const publishers = form.publishers ? form.publishers.map((pub) => pub.id) : [];
    const managers = form.managers ? form.managers.map((man) => man._id) : [];
    return {
      period,
      publishers,
      managers
    };
  }

  _reset(e: Event, list: string) {
    this.invoicesForm.get(list).setValue([]);
    e.stopPropagation();
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

  private filterManagers(): void {
    if (!this.managersList) {
      return;
    }

    let search = this.managersFilter.value;
    if (!search) {
      this.filteredManagers.next(this.managersList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredManagers.next(this.managersList.filter((manager) => manager.manager.toLowerCase().indexOf(search) > -1));
  }

  getAllInvoices(user) {
    const reqData = {
      period: {
        begin: moment(new Date()).subtract(3, 'year').format('YYYY-MM-DD'),
        end: moment(new Date()).add(1, 'month').format('YYYY-MM-DD')
      },
      managers: [],
      publishers: [user._id]
    };
    this.isLoaded.emit(true);

    const getAllInvoicesSub = this.crudService
      .getInvoices(reqData)
      .pipe(
        // @ts-ignore
        catchError((err) => {
          this.showError(this.translate.instant(`INVOICES.ERRORS.${ err.error.msg }`));
        })
      )
      .subscribe((data: Invoice[] | any) => {
        if (!data) {
          this.currentInvoices.emit([]);
          this.isLoaded.emit(false);
          return (this.invoices = []);
        }
        this.isLoaded.emit(false);
        this.invoices = data;
        this.currentInvoices.emit(this.invoices);
      })

    this.subscriptions.add(getAllInvoicesSub);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.updateInvoicesList && changes.updateInvoicesList.currentValue) {
      this.getAllInvoices(this.user);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
