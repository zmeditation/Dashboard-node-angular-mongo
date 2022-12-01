import moment from 'moment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators, AbstractControl } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DateAdapter } from '@angular/material/core';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { AppTranslationService } from 'shared/services/translation/translation.service';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { DeductionService } from '../../../../../shared/services/cruds/deduction.service';
import { DeductionType } from '../../../../../shared/constants/deduction-type.enum';

type Deduction = {
  date: string;
  deduction: number;
}

type UserForDeduction = {
  _id: string;
  name: string;
}

type DeductionsPublisher = {
  _id: string;
  deductions: Deduction[]
  refs_to_user: UserForDeduction;
}

type SymbolAllowed = {
  symbolsError: string;
}

@Component({
  selector: 'app-report-deduction-uploader',
  templateUrl: './report-deduction-uploader.component.html',
  styleUrls: ['./report-deduction-uploader.component.scss']
})
export class ReportDeductionUploaderComponent implements OnInit, OnDestroy {
  public deductionTypes: { key: string; value: string }[];

  public selectedDate: any;

  public publisherIdSelected = '';

  public min: Date;

  public max = '';

  public loading = false;

  public deductionsLoading = false;
  public deductionsLoaded = false;

  protected _failureDeduction = '';

  protected publisherList: DeductionsPublisher[] = [];

  protected selectedpublisherDeductions: Deduction[] = [];

  protected dateAvailable = {
    min: new Date('2018-12'),

    max() {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return date.toISOString();
    }
  }

  public deductionForm: FormGroup;

  public filteredPublisher: Observable<DeductionsPublisher[]>;

  protected subscriptions: Subscription = new Subscription();

  // Deduction error
  set failureQueryAllDeductions(value: string) {
    if (value === '') {
      this.deductionForm.enable();
    } else if (typeof value === 'string' && value.length > 0) {
      this.deductionForm.disable();
    }
    this._failureDeduction = value;
  }

  get failureQueryAllDeductions() {
    return this._failureDeduction;
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    protected flashMessage: FlashMessagesService,
    protected deductionService: DeductionService,
    protected dateAdapter: DateAdapter<any>,
    protected appTranslation: AppTranslationService,
    private fb: FormBuilder,
  ) {
    this.deductionTypes = Object.entries(DeductionType).map(([key, value]) => ({ key, value }));
    this.handleDatepickerLang();
  }

  ngOnInit(): void {
    this.initForm();
    this.getPublishersDeductions();

    this.min = this.dateAvailable.min;
    this.max = this.dateAvailable.max();
    this.watchDateChanges();
    this.watchPublisherChanges();
    this.watchDeductionChanges();
  }

  protected initForm(): void {
    this.deductionForm = this.fb.group({
      date: ['', Validators.required],
      publisher: [[], Validators.required],
      deductions: this.fb.group(
        Object.values(DeductionType).reduce(
          (acc, type) => ({ ...acc,
            [type]: [, [Validators.required, this.deductionValidator()]]
          }),
          {}
        )
      )
    });
  }

  private watchDeductionChanges() {
    Object.values(DeductionType).forEach(type => {
      const deductionField = this.deductionForm.controls.deductions.get(type);

      this.subscriptions.add(
        deductionField.valueChanges.subscribe(
          value => {
            if (!value) return;

            let filteredValue = value.toString()
              // remove any character if it is not a number, dot or comma
              .replace(/[^\d.,]/g, '')
              .replace(',', '.');

            // remove extra dots
            if (filteredValue.replace(/[^.]/g, "").length > 1) {
              const [number, fractional] = filteredValue.split('.')
              fractional.replaceAll('.', '');
              filteredValue = `${number}.${fractional}`;
            }

            if (filteredValue.slice(filteredValue.length - 1) !== '.') {
              filteredValue = parseFloat(filteredValue);
            }

            deductionField.setValue(filteredValue, { emitEvent: false });
          }
        )
      );
    });
  }

  protected watchPublisherChanges(): void {
    this.filteredPublisher = this.deductionForm.get('publisher').valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : '')),
      map((filter) => this.searchPublisher(filter)),
      map((filter) => this.filterPublisher(filter)),
      tap(() => this.fetchDeductions()),
    );
  }

  protected watchDateChanges(): void {
    const dateSub = this.deductionForm.get('date').valueChanges
      .subscribe((date) => {
        if (!date) return;

        this.chosenMonthHandler(date);
        this.fetchDeductions();
      });
    this.subscriptions.add(dateSub);
  }

  private fetchDeductions() {
    if (!this.publisherIdSelected || !this.selectedDate) return;

    const dateFrom = moment.utc(this.selectedDate).startOf('month').toISOString();
    const dateTo = moment.utc(this.selectedDate).endOf('month').toISOString();

    const query = {
      showDetailedDeductions: true,
      publishersId: [ this.publisherIdSelected ],
      customRange: { dateFrom, dateTo }
    };

    this.deductionsLoading = true;
    this.deductionsLoaded = false;
    this.deductionService.getPublisherDeductions(query).subscribe(
      ({ publishers: [publisher] }) => {

        const deductions = publisher
          ? publisher.deductions.reduce(
              (acc, { type, deduction }) => ({ ...acc, [type]: deduction }),
              {}
            )
          : Object.values(DeductionType).reduce(
              (acc, type) => ({ ...acc, [type]: 0 }),
              {}
            );

        this.deductionForm.controls.deductions.setValue(deductions);

        this.deductionsLoading = false;
        this.deductionsLoaded = true;
      },
      () => {
        this.deductionsLoading = false;
        this.deductionsLoaded = true;
      }
    );
  }

  protected handleDatepickerLang() {
    this.dateAdapter.setLocale(this.appTranslation.lang);

    const langSub = this.appTranslation.langSubject.subscribe((lang: string) => {
      this.dateAdapter.setLocale(lang);
    });
    this.subscriptions.add(langSub);
  }

  protected filterPublisher(name: string): any {
    return this.publisherList.filter((option) => option.refs_to_user.name.toLowerCase().includes(name.toLowerCase()));
  }

  protected searchPublisher(name: string) {
    const publisher = this.publisherList.find((pubDed) => {
      return pubDed.refs_to_user.name.toLowerCase() === name.toLowerCase()
    });

    publisher && this.selectePublisher(publisher);
    if (!publisher && this.publisherIdSelected) {
      this.clearSelectedInput('publisher');
    }

    return name;
  }

  protected selectePublisher(publisher: DeductionsPublisher): void {
    this.publisherIdSelected = publisher.refs_to_user._id;
    this.selectedpublisherDeductions.push(...publisher.deductions);
  }

  protected getPublishersDeductions(): void {
    this.loading = true;
    this.failureQueryAllDeductions = '';

    const getDeductionsSub = this.deductionService.geAllDeductions().subscribe((data) => {
      const { publishers, success, error } = data;

      if (error) {
        this.failureQueryAllDeductions = error.msg;
        this.loading = false;
        return;
      }

      if (success && publishers) {
        this.publisherList = publishers;
        this.loading = false;
      }

      this.deductionForm.get('publisher').reset();
    });
    this.subscriptions.add(getDeductionsSub);
  }

  protected chosenMonthHandler(date: Date): void {
    const newDate = new Date(date);
    const fullYear = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = new Date(fullYear, month, 0).getDate();

    let dateLastDayInMonth = fullYear + '-' + month + '-' + day;
    dateLastDayInMonth = new Date(dateLastDayInMonth).toISOString().split('T')[0];
    this.selectedDate = dateLastDayInMonth;
  }

  public dayFilter = (data: { _d: Date }): boolean => {
    // In calendar allowing only first day of month
    const day = data._d.getDate();
    return day === 1;
  };

  protected isSymbolAllowed(numbers: number): SymbolAllowed {
    const errorSymbols = 'Deduction must contain allowed symbols ( 0-9 . - ).';
    let symbolsError = '';

    const symbols = numbers.toString().split('');

    let allowedHyphen = 0;
    let allowedDot = 0;

    const anotherSymbols = symbols.every((el) => el.match(/[0-9]|[.-]/));

    if (anotherSymbols === false) {
      return { symbolsError: errorSymbols };
    } else if (symbols.length > 8) {
      symbolsError = 'Max length 8 symbols.';
    }

    symbols.forEach((el) => {
      if (el.match(/[.]/)) {
        ++allowedDot;
      } else if (el.match(/[-]/)) {
        ++allowedHyphen;
      }
    });

    const alowedSymbols = symbols.some((el) => el.match(/[0-9]/));

    if (allowedDot > 1) {
      symbolsError = 'Error, more than one dot`s symbol.';
    } else if (allowedHyphen > 1) {
      symbolsError = 'Error, more than one hyphen`s symbol.';
    } else if (alowedSymbols === false) {
      symbolsError = 'Error, deduction must contain numbers.';
    }

    return { symbolsError };
  }

  private deductionValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return;

      const { symbolsError } = this.isSymbolAllowed(control.value);
      return symbolsError ? { invalidValue: { message: symbolsError } } : null;
    };
  }

  public addDeductionToPubl(): void {
    let deductions = this.deductionForm.get('deductions').value;

    deductions = Object.entries(deductions).reduce(
      (acc, [type, deduction]) => [...acc, { type, deduction }], []
    );

    const addDedSub = this.deductionService.bulkAddDeduction(
      this.publisherIdSelected,
      this.selectedDate,
      deductions,
    ).subscribe(
      (data) => {
        const { successMsg, success, error } = data;

        if (error) {
          this.flashMessage.flash('error', error.msg, 4000, 'top');
          return;
        }

        if (success === true) {
          this.clearSelectedInput('publisher');

          this.getPublishersDeductions();
          this.flashMessage.flash('success', successMsg, 4000);
        }
      },

      (err) => {
        const error = err.error;
        if (error.success === false) {
          this.flashMessage.flash('error', error.msg, 4000);
        }
      }
    );
    this.subscriptions.add(addDedSub);
  }

  public clearSelectedInput(inputName: string, event?: Event): void {
    // tslint:disable-next-line: no-unused-expression
    event && event.preventDefault();

    switch (inputName) {
      case 'publisher':
        this.publisherIdSelected = '';
        this.selectedpublisherDeductions = [];
      case 'date':
        this.deductionsLoaded = false;
        this.deductionForm.controls.deductions.reset();
      default:
        this.deductionForm.get(inputName).reset();
        break;
    }
  }

  public get isMobile(): boolean {
    return this.breakpointObserver.isMatched('(max-width: 767px)');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
