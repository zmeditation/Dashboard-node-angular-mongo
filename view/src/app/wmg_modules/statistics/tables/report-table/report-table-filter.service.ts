import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ReportTableFilterService {
  public _reportFilterHandler = new Subject<any>();

  reportFilterListener$ = this._reportFilterHandler.asObservable();

  constructor() {}

  updateFilter(filterValue) {
    this._reportFilterHandler.next(filterValue);
  }
}
