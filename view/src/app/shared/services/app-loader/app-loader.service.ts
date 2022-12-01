import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AppLoaderComponent } from './app-loader.component';

@Injectable()
export class AppLoaderService {
  dialogRef: MatDialogRef<AppLoaderComponent>;

  constructor(private dialog: MatDialog) {}

  public open(title = 'Please wait', width = 'auto', height = 'auto'): Observable<boolean> {
    this.dialogRef = this.dialog.open(AppLoaderComponent, {
      width: width,
      height: height,
      disableClose: true
    });
    this.dialogRef.componentInstance.title = title;
    return this.dialogRef.afterClosed();
  }

  public close() {
    if (this.dialogRef) { this.dialogRef.close(); } 
    
  }
}
