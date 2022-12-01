import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { Invoice } from "shared/interfaces/common.interface";
import { EventCollectorService } from "shared/services/event-collector/event-collector.service";
import { User } from "shared/interfaces/users.interface";
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: "app-invoices-table",
  templateUrl: "./invoices-table.component.html",
  styleUrls: ["./invoices-table.component.scss"]
})
export class InvoicesTableComponent implements OnInit, OnChanges {
  invoices: Invoice[];

  invoiceStatusFilter: string;

  role = "";

  load: boolean;

  sub: Subscription;

  @Output() invoiceList = new EventEmitter();

  @Output() updateInvoiceList: { success: boolean; file: string };

  @Output() isLoaded = new EventEmitter();

  @Input() uploaded: { success: boolean; file: string };

  constructor(public event: EventCollectorService) {}

  ngOnInit(): void {
    this.sub = this.event.managedUserInfo$.subscribe((user: User) => {
      this.role = user.role;
    });
  }

  sendInvoices(event): void {
    this.invoices = event;
    this.invoiceList.emit(this.invoices);
  }

  updateLoadStatus(event): void {
    this.load = event;
    this.isLoaded.emit(event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.uploaded && changes.uploaded.currentValue) {
      this.updateInvoiceList = changes.uploaded.currentValue;
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
