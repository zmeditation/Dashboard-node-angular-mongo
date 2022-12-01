import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Revenue } from 'shared/interfaces/invoice.interface';
import { CrudService } from 'shared/services/cruds/crud.service';
import { egretAnimations } from 'shared/animations/egret-animations';
import moment from 'moment';
import { FormControl } from '@angular/forms';
import { SatDatepicker } from 'saturn-datepicker';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Publisher } from 'shared/interfaces/common.interface';
import { FilterRequestService } from '../../../../../wmg_modules/statistics/main-filter/filter-request-services/filter-request.service';
import { EventCollectorService } from 'shared/services/event-collector/event-collector.service';
import { MatDialog } from '@angular/material/dialog';
import { RevenuePopupComponent } from './revenue-popup/revenue-popup.component';
import { User } from 'shared/interfaces/users.interface';
import { Subscription } from "rxjs/Rx";

@Component({
  selector: 'app-revenue-table',
  templateUrl: './revenue-table.component.html',
  styleUrls: ['./revenue-table.component.scss'],
  animations: egretAnimations
})
export class RevenueTableComponent implements OnInit, OnDestroy {

  constructor(
    private crudService: CrudService,
    public filterRequestService: FilterRequestService,
    public event: EventCollectorService,
    public dialog: MatDialog
  ) { }

  public revenues: Revenue[];

  public loaded = false;

  public maxDate: Date | any = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  public minDate: Date | any = new Date('2021-07-01');

  public revenueDateRange: FormControl = new FormControl();

  public publishersListControl: FormControl = new FormControl();

  public pubsFilter: FormControl = new FormControl();

  public modesControl: FormControl = new FormControl();

  public filteredPubs: ReplaySubject<Publisher[]> = new ReplaySubject<Publisher[]>(1);

  private subscriptions: Subscription = new Subscription();

  role: string;

  @Input() user: User;

  @Input() publishersList: Publisher[];

  ngOnInit(): void {
    this.role = this.user.role;
    if (this.user?.role !== 'PUBLISHER') {
      const getAllRevenuesSub = this.crudService
        .getAllRevenues()
        .subscribe((data: { success: boolean, result: Revenue[] } | null) => {
          this.revenues = this.getTotalRevenues(data?.result);
          this.loaded = true;
        });

      this.subscriptions.add(getAllRevenuesSub);
    } else {
      const getUsersRevenuesSub = this.crudService
        .getSelectedRevenues(`publisher=${ this.user._id }`)
        .subscribe((data: { success: boolean, result: Revenue[] } | null) => {
          this.revenues = this.getTotalRevenues(data?.result);
          this.loaded = true;
        });

      this.subscriptions.add(getUsersRevenuesSub);
    }

    const pubsFiltersSub = this.pubsFilter.valueChanges
      .subscribe(() => {
        this.filterPubs();
      });

    this.subscriptions.add(pubsFiltersSub);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.publishersList && changes.publishersList.currentValue?.length) {
      this.filteredPubs.next(this.publishersList.slice());
    }
  }

  parseDatePeriod(begin: string, end: string): string {
    begin = moment(begin).format('MMMM YYYY');
    end = moment(end).format('MMMM YYYY');
    return begin === end ? begin : `${ begin } - ${ end }`;
  }

  calculateSum(revenue: number, revenue_rtb: number, deduction: number): string {
    if (deduction > 0) {
      deduction = -deduction
    }
    return (revenue + revenue_rtb + deduction).toFixed(2);
  }

  showDetailedRevenue(row: Revenue): void {
    this.dialog.open(RevenuePopupComponent, { data: row });
  }

  onMonthSelected(event: moment.Moment, dp: SatDatepicker<any>): void {
    this.revenueDateRange.patchValue({
      begin: event.toDate(),
      end: new Date(event.toDate().getFullYear(), event.toDate().getMonth() + 1, 0)
    });
    dp.close();
  }

  searchRevenuesByQuery(period: { begin: string, end: string } | null, publisher: Publisher | null) {
    let begin, end;
    if (period !== null) {
      begin = moment(period.begin).format('YYYY-MM-DD');
      end = moment(period.end).format('YYYY-MM-DD');
    }
    const searchParams: { begin?: string, end?: string, publisher?: string } = begin && end ? { begin, end } : {};
    if (publisher) {
      searchParams.publisher = publisher.id;
    }

    const query = Object.keys(searchParams)
      .map(param => encodeURIComponent(param) + '=' + encodeURIComponent(searchParams[param]))
      .join('&');

    this.loaded = false;
    this.revenues = [];

    this.subscriptions.add(this.crudService.getSelectedRevenues(query)
      .subscribe((data: { success: boolean, result: Revenue[] } | null) => {
        this.revenues = data?.result;
        this.loaded = true;
      }));
  }

  _reset(e: Event): void {
    this.publishersListControl.patchValue('');
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

    this.filteredPubs.next(
      this.publishersList.filter(
        (pub) => pub.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  getTotalRevenues(revenues: Revenue[]): Revenue[] {
    for (const value of revenues) {
      const deduction = value.deduction < 0 ? value.deduction : -value.deduction;
      value.total = value.revenue + deduction + value.revenue_rtb
    }
    return revenues;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
