import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { EventCollectorService } from 'shared/services/event-collector/event-collector.service';
import { FilterRequestService } from '../../../../wmg_modules/statistics/main-filter/filter-request-services/filter-request.service';
import { CrudService } from 'shared/services/cruds/crud.service';
import { IOwnManagersResponse } from 'shared/services/cruds/interfaces/own-managers-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserManagerResolver implements Resolve<Promise<IOwnManagersResponse>> {
  constructor(private event: EventCollectorService, private filterRequestService: FilterRequestService, private crud: CrudService) {
    // Empty
  }

  public resolve(): Promise<IOwnManagersResponse> {
    return this.crud.ownManagers().toPromise();
  }
}
