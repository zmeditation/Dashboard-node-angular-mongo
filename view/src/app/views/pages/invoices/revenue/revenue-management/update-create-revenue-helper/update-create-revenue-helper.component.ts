import { Component, OnInit, Input, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SatDatepicker } from 'saturn-datepicker';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Publisher, RevenueManagementMode } from 'shared/interfaces/common.interface';
import { CrudService } from 'shared/services/cruds/crud.service';
import { FilterRequestService } from '../../../../../../wmg_modules/statistics/main-filter/filter-request-services/filter-request.service';
import moment from 'moment';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from "rxjs/Rx";


@Component({
  selector: 'app-update-create-revenue-helper',
  templateUrl: './update-create-revenue-helper.component.html',
  styleUrls: ['./update-create-revenue-helper.component.scss']
})
export class UpdateCreateRevenueHelperComponent implements OnInit, OnDestroy {

  @Input() mode: RevenueManagementMode;

  @Input() publishersList: Publisher[];

  public maxDate: Date | any = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  public minDate: Date | any = new Date(new Date().getFullYear() - 3, 0, 1);

  public revenueDateRange: FormControl = new FormControl();

  public publishersListControl: FormControl = new FormControl('', Validators.required);

  public pubsFilter: FormControl = new FormControl();

  public revenue: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]);

  public revenue_rtb: FormControl = new FormControl('', [Validators.pattern(/^\d*\.?\d*$/)]);

  public deduction: FormControl = new FormControl('', [Validators.pattern(/^-\d*\.?\d*$/)]);

  public deleteMode: FormControl = new FormControl();

  public filteredPubs: ReplaySubject<Publisher[]> = new ReplaySubject<Publisher[]>(1);

  private subscriptions: Subscription = new Subscription();

  public buttonIconState = {
    'input': 'create',
    'update': 'upgrade',
    'delete': 'delete'
  }

  constructor(
    private crudService: CrudService,
    public filterRequestService: FilterRequestService,
    private flashMessage: FlashMessagesService,
    private translate: TranslateService
  ) {
  }

  get isButtonActive(): boolean {
    switch (this.mode) {
      case 'delete':
        return (this.deleteMode.value === 'byDate' && this.revenueDateRange.value)
          || (this.deleteMode.value === 'byPublisher' && this.publishersListControl.value);
      case 'input' :
        return (this.revenueDateRange.value && this.publishersListControl.valid && this.revenue.valid)
          && !this.deduction.invalid && !this.revenue_rtb.invalid;
      case 'update':
        return (this.revenueDateRange.value && this.publishersListControl.valid && this.revenue.valid)
          && !this.deduction.invalid && !this.revenue_rtb.invalid;
      default:
        return false;
    }
  }

  ngOnInit(): void {
    if (this.mode === 'delete') {
      this.publishersListControl.clearValidators();
    } else {
      this.publishersListControl.setValidators(Validators.required);
    }
    this.subscriptions.add(
      this.pubsFilter.valueChanges
        .subscribe(() => {
          this.filterPubs();
        }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.publishersList && changes.publishersList.currentValue?.length) {
      this.filteredPubs.next(this.publishersList.slice());
    }
  }

  onMonthSelected(event: moment.Moment, dp: SatDatepicker<any>): void {
    this.revenueDateRange.patchValue({
      begin: event.toDate(),
      end: new Date(event.toDate().getFullYear(), event.toDate().getMonth() + 1, 0)
    });
    dp.close();
  }

  setRevenue(mode: RevenueManagementMode): void {
    let query: any = {
      publisher: this.publishersListControl.value ? this.publishersListControl.value.id : '',
      begin: this.revenueDateRange.value ? moment(this.revenueDateRange.value.begin).format('YYYY-MM-DD') : undefined,
      end: this.revenueDateRange.value ? moment(this.revenueDateRange.value.end).format('YYYY-MM-DD') : undefined,
      revenue: this.revenue.value,
      revenue_rtb: this.revenue_rtb.value,
      deduction: this.deduction.value
    };

    if (mode === 'delete') { // update query object to fit query requirements
      query.mode = this.deleteMode.value;
      delete query.revenue;
      delete query.revenue_rtb;
      delete query.deduction;
      if (query.mode === 'byPublisher' && !this.revenueDateRange.value) {
        delete query.begin;
        delete query.end;
      }
      query.publisher = this.publishersListControl.value ? this.publishersListControl.value.id : ''
      query = Object.keys(query)
        .map(param => encodeURIComponent(param) + '=' + encodeURIComponent(query[param]))
        .join('&');
    }

    switch (mode) {
      case 'input':
        this.addRevenue(query);
        break;
      case 'update':
        this.updateRevenue(query);
        break;
      case 'delete':
        this.deleteRevenue(query);
        break;
      default:
        break;
    }
  }

  addRevenue(query) {
    this.subscriptions.add(
      this.crudService.createRevenue(query)
        .subscribe((data) => {
          this.processResponse(data);
        }, (error) => {
          if (error.error?.result) {
            this.processResponse(error.error)
          }
        }));
  }

  updateRevenue(query) {
    this.subscriptions.add(
      this.crudService.updateRevenue(query)
        .subscribe(
          (data) => {
            this.processResponse(data);
          }, (error) => {
            if (error.error?.result) {
              this.processResponse(error.error)
            }
          }));
  }

  deleteRevenue(query) {
    this.subscriptions.add(
      this.crudService.deleteRevenue(query)
        .subscribe((data) => {
          this.processResponse(data);
        }, (error) => {
          if (error.error?.result) {
            this.processResponse(error.error)
          }
        }));
  }

  getValidationErrorMessage(formControlName: string, formControl: FormControl): string {
    if (formControl.hasError('pattern')) {
      return formControlName === 'deduction'
        ? 'REVENUE.ERRORS.NOT_A_NEGATIVE_NUMBER'
        : 'REVENUE.ERRORS.NOT_A_NUMBER';
    }

    return 'REVENUE.ERRORS.REQUIRED_FIELD'
  }

  processResponse(response: { success: boolean, result: any }): void {
    response.success === true
      ? this.flashMessage.flash('success', this.translate.instant('REVENUE.' + response.result), 3000)
      : this.flashMessage.flash('error', this.translate.instant('REVENUE.ERRORS.' + response.result), 3000);
  }

  _reset(e: Event): void {
    this.publishersListControl.patchValue('');
    e.stopPropagation();
  }

  private filterPubs(): void {
    if (!this.publishersList) {
      return;
    }

    let search: string = this.pubsFilter.value;
    if (!search) {
      this.filteredPubs.next(this.publishersList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredPubs.next(
      this.publishersList.filter(
        (pub) => pub.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
