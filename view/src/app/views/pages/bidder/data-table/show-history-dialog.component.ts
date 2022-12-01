import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { parse } from 'json2csv';

@Component({
  selector: 'app-show-history-dialog-component',
  templateUrl: './show-history-dialog-component.html',
  styleUrls: ['./show-history-dialog.component.scss']
})
export class ShowHistoryDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  downloadFile(csv: string, filename: string): void {
    const blob = new Blob(['\ufeff' + csv], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
    if (isSafariBrowser) {
    // if Safari, open in new window to save file with random filename.
      link.setAttribute('target', '_blank');
    }

    link.setAttribute('href', url);
    link.setAttribute('download', filename + '.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadCsvChangelog(data: Array<any>, id: string): void {
    const fields = ['date', 'user', 'event', 'bidders', 'settings', 'addons'];
    const opts = { fields };
    const csv = parse(data, opts);
    this.downloadFile(csv, `changelog_${ id }`);
  }
}
