import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterDialogService {
  private _filterDialogHandler = new Subject<any>();

  filterDialogListener$ = this._filterDialogHandler.asObservable();

  private _removeFromResultsHandler = new Subject<any>();

  removeFromResults$ = this._removeFromResultsHandler.asObservable();

  removeFromResults(listItemValue) {
    this._removeFromResultsHandler.next(listItemValue);
  }

  updateFilterDialogResults(dialogResultsArray) {
    this._filterDialogHandler.next(dialogResultsArray);
  }
}
