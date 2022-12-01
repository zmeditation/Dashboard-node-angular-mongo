import { Component, OnInit } from '@angular/core';
import { Invoice } from 'shared/interfaces/common.interface';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[];

  uploaded: { success: boolean; file: string };

  constructor() {}

  ngOnInit(): void {}

  sendInvoices(event) {
    this.invoices = event;
  }

  invoiceUploaded(event) {
    this.uploaded = event;
  }
}
