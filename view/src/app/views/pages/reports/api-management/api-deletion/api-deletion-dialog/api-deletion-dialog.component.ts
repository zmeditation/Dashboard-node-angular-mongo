import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';

interface APIDeletionQuery {
  programmatic: string;
  publisher: any;
  properties: any;
  dateFrom: string;
  dateTo: string;
}

@Component({
  selector: 'app-api-deletion-dialog',
  templateUrl: './api-deletion-dialog.component.html',
  styleUrls: ['./api-deletion-dialog.component.scss']
})
export class ApiDeletionDialogComponent implements OnInit {
  query: APIDeletionQuery = {
    programmatic: '',
    publisher: {},
    properties: [],
    dateFrom: '',
    dateTo: ''
  };

  constructor(
    public dialogRef: MatDialogRef<ApiDeletionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: APIDeletionQuery
  ) {}

  ngOnInit() {
    this.query = {
      programmatic: this.data.programmatic,
      publisher: !this.data.publisher._id ? null : this.data.publisher,
      properties: this.data.properties,
      dateFrom: this.formatDate(this.data.dateFrom),
      dateTo: this.formatDate(this.data.dateTo)
    };
  }

  formatDate(date): string {
    if (!date) { return ''; } 

    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
