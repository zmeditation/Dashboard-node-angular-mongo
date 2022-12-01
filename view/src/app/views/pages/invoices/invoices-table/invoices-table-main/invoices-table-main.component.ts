import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  Invoice,
  STATUSES,
  PERMISSIONS
} from 'shared/interfaces/common.interface';
import {egretAnimations} from 'shared/animations/egret-animations';
import {CrudService} from 'shared/services/cruds/crud.service';
import {NgxPermissionsObject, NgxPermissionsService} from 'ngx-permissions';
import {EventCollectorService} from 'shared/services/event-collector/event-collector.service';
import {User} from 'shared/interfaces/users.interface';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import moment from 'moment';
import {CancelReasonDialogComponent} from '../cancel-reason-dialog/cancel-reason-dialog.component';
import {InvoiceDeleteConfirmComponent} from './invoice-delete-confirm/invoice-delete-confirm.component';
import {MatDialog} from '@angular/material/dialog';
import {CancelReason} from 'shared/interfaces/invoice.interface';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-invoices-table-main',
  templateUrl: './invoices-table-main.component.html',
  styleUrls: ['./invoices-table-main.component.scss'],
  animations: egretAnimations
})
export class InvoicesTableMainComponent
implements OnInit, OnChanges, OnDestroy {
    @Input() invoices: Invoice[];

    public statuses = Object.keys(STATUSES);

    private _onDestroy = new Subject<void>();

    public innerWidth: number;

    temp: Invoice[] = [];

    canEditInvoices: boolean;

    role = '';

    inv: { _id: string; status: STATUSES }[];

    st = STATUSES;

    invoiceStatus = new FormControl();

    private _load: boolean;

    get load(): boolean {
      return this._load;
    }

    @Input()
    set load(value: boolean) {
      this._load = value;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: UIEvent) {
      const w = event.target as Window;
      this.innerWidth = w.innerWidth;
    }

    constructor(
        private crudService: CrudService,
        public NgxPermissions: NgxPermissionsService,
        public event: EventCollectorService,
        public dialog: MatDialog,
        public deleteDialog: MatDialog
    ) {
    }

    ngOnInit(): void {
      this.invoiceStatus.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(
          (status: STATUSES | undefined) => {
            this.updateFilter(status);
          }
        );
      this.event.managedUserInfo$
        .pipe(takeUntil(this._onDestroy))
        .subscribe((user: User) => {
          this.role = user.role;
        });
      this.innerWidth = window.innerWidth;
      this.NgxPermissions.permissions$.subscribe(
        (permissions: NgxPermissionsObject) => {
          this.canEditInvoices = Object.keys(permissions).includes(
            PERMISSIONS.EDIT
          );
        }
      );
    }

    updateInvoiceStatus(event: string, row: Invoice): void {
      if (event === 'declined') {
        let cancelReason: string;
        const cancelReasonDialog = this.dialog.open(CancelReasonDialogComponent, {
          width: '50%'
        });
        cancelReasonDialog
          .afterClosed()
          .pipe(takeUntil(this._onDestroy))
          .subscribe((data: CancelReason | null) => {
            if (data) {
              cancelReason = data.reason;
              this.crudService
                .changeInvoiceStatus(
                  row._id,
                  event,
                  row.publisher._id,
                  cancelReason
                )
                .pipe(takeUntil(this._onDestroy))
                .subscribe();
            } else {
              // set previous status of invoice
              for (const i of this.inv) {
                if (i._id === row._id) {
                  this.invoices.forEach((invoice) => {
                    if (invoice._id === row._id) { invoice.status = i.status; }
                    
                  }); 
                } 
              }
                
              
            }
          });
      } else {
        this.crudService
          .changeInvoiceStatus(row._id, event, row.publisher._id)
          .pipe(takeUntil(this._onDestroy))
          .subscribe();
      }
    }

    updateFilter(status: string): void {
      this.invoices = this.temp.filter((i: Invoice) => {
        return i.status.toLowerCase().indexOf(status) !== -1 || !status;
      });
    }

    downloadInvoice(id: string, row: Invoice): void {
      this.crudService
        .downloadInvoice(id)
        .pipe(takeUntil(this._onDestroy))
        .subscribe((res: Blob) => {
          const blob = new Blob([res]);
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `${ row.name }`;
          a.click();
          a.remove();
        });
    }

    deleteInvoice(id: string): void {
      const deleteDialog = this.deleteDialog.open(InvoiceDeleteConfirmComponent, {
        width: '50%',
        data: this.invoices.filter((i) => i._id === id)[0]
      });
      deleteDialog.afterClosed().subscribe((data: boolean | undefined) => {
        if (data) {
          this.crudService
            .deleteInvoice(id)
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.invoices = this.invoices.filter((i) => i._id !== id);
              this.temp = this.invoices;
            }); 
        }
        
      });
    }

    parseDatePeriod(period: { begin: string; end: string }): string {
      let {begin, end} = period;
      begin = moment(begin).format('MMMM YYYY');
      end = moment(end).format('MMMM YYYY');

      if (begin === end) { return begin; }
      
      return `${ begin } - ${ end }`;
    }

    getDate(date: string): string {
      return moment.utc(date).format('DD.MM.YYYY HH:mm');
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes.invoiceStatusFilter) { this.updateFilter(changes.invoiceStatusFilter.currentValue); }
      

      if (changes.invoices) {
        this.temp = changes.invoices.currentValue;
        if (
          changes.invoices.previousValue &&
                changes.invoices.previousValue.length === 0 &&
                changes.invoices.currentValue.length
        ) {
          this.inv = changes.invoices.currentValue.map((invoice: Invoice) => {
            return {_id: invoice._id, status: invoice.status};
          }); 
        }
        
      }
    }

    ngOnDestroy(): void {
      this._onDestroy.next();
      this._onDestroy.complete();
    }
}
