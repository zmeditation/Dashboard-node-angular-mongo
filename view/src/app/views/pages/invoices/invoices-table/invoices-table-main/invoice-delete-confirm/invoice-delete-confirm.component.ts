import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Invoice } from 'shared/interfaces/common.interface';

@Component({
  selector: 'app-invoice-delete-confirm',
  templateUrl: './invoice-delete-confirm.component.html',
  styleUrls: ['./invoice-delete-confirm.component.scss']
})
export class InvoiceDeleteConfirmComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public invoice: Invoice
  ) {}

  ngOnInit(): void {}
}
