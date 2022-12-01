import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupStringsForAdsTxtComponent } from '../popup-strings-for-ads-txt/popup-strings-for-ads-txt.component';
import AdstxtAll from './adstxt.json';

@Injectable({providedIn: 'root'})
export class OpenPopup {
  constructor(public dialog: MatDialog) {}

  openDialog(data: any): void {
    const programmaticName = data.name === 'google ad manager' ||
    data.name === 'google ad manager hb'
      ? 'google'
      : data.name.toLowerCase();
    const currentAdsTxt = this.highlightMissedStrings(data.absent, AdstxtAll[programmaticName]);
    if (Object.keys(AdstxtAll).includes(programmaticName)) {
      const dialogRef = this.dialog.open(PopupStringsForAdsTxtComponent, {
        width: '70vw',
        data: {
          dataStrings: currentAdsTxt,
          programmatic: programmaticName,
          success: true
        }
      });
      dialogRef.afterClosed().subscribe();
    } else {
      if (programmaticName === 'domain_not_checked') { return; } 

      const dialogRef = this.dialog.open(PopupStringsForAdsTxtComponent, {
        width: '70vw',
        data: {
          dataStrings: currentAdsTxt,
          success: false,
          programmatic: programmaticName,
          msg: 'NO_SUCH_PROGRAMMATIC'
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        // console.log('The dialog was closed');
      });
    }
  }

  highlightMissedStrings(absent: Array<number>, source) {
    if (!source) { return; } 

    return source.map((el) => {
      el.absent = absent.includes(el.id);
      return el;
    });
  }
}
