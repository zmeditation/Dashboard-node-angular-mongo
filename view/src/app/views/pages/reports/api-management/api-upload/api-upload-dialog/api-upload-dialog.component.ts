import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface APIUploadInterface {
  programmatic: string;
  dateFrom: string;
  dateTo: string;
}

@Component({
  selector: 'app-api-upload-dialog',
  templateUrl: './api-upload-dialog.component.html',
  styleUrls: ['./api-upload-dialog.component.scss']
})
export class ApiUploadDialogComponent implements OnInit {
  query = {
    programmatic: '',
    dateFrom: '',
    dateTo: ''
  };

  constructor(public dialogRef: MatDialogRef<ApiUploadDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: APIUploadInterface) {}

  ngOnInit() {
    this.query = {
      programmatic: this.data.programmatic,
      dateFrom: this.data.dateFrom,
      dateTo: this.data.dateTo
    };
  }
}
