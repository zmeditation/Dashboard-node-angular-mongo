import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { EventCollectorService } from 'shared/services/event-collector/event-collector.service';
import { takeLast } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { INameableEntity } from 'shared/interfaces/nameable-entity.interface';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserResolver implements Resolve<INameableEntity> {
  constructor(private event: EventCollectorService) {
    // Empty
  }

  public resolve(): Promise<INameableEntity> {
    const currentUserObserver = this.event.managedUserInfo$;
    const value = currentUserObserver && (currentUserObserver.source as BehaviorSubject<INameableEntity>).value;

    if (value) { return Promise.resolve(value); } 
    

    return new Promise((resolve, reject) => {
      this.event.managedUserInfo$.pipe(takeLast(1)).subscribe((user) => resolve(user), reject);
    });
  }
}
