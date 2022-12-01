import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs/Rx';


@Injectable({
  providedIn: 'root'
})

export class UpdateChartsValueService {
    private subject$ = new Subject();

    constructor() {
    }

    emit(event: string): void {
      this.subject$.next(event);
    }

    status(): Observable<any> {
      return this.subject$.asObservable();
    }
}
