import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnalyticsEndpointsService } from 'shared/services/cruds/analytics-endpoints.service';
import { TestUserType } from 'shared/types/users';

@Injectable({
  providedIn: 'root'
})
export class TestUsersService {
  public testUsersStatistics = new BehaviorSubject<TestUserType[]>([]);

  public constructor(
    protected analyticsEndpoints: AnalyticsEndpointsService
  ) {}

  public loadTestUsersStatistics(): void {
    this.analyticsEndpoints.getTestUsers(['ACCOUNT MANAGER', 'SENIOR ACCOUNT MANAGER']).subscribe(
      (response) => {
        this.testUsersStatistics.next(response.data);
      },
      (errorResponse) => {
        this.testUsersStatistics.next([]);
      }
    );
  }
}
