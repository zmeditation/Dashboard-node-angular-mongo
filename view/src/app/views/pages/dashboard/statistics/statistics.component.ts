import { Component, OnDestroy, OnInit } from '@angular/core';
import { TestUsersService } from 'shared/services/user/test-users.service';
import { egretAnimations } from 'shared/animations/egret-animations';

@Component({
  selector: 'app-analytic',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  animations: egretAnimations
})
export class StatisticsComponent implements OnInit, OnDestroy {
  public constructor(
    protected testUsersService: TestUsersService
  ) {}

  ngOnInit() {
    this.testUsersService.loadTestUsersStatistics();
  }

  ngOnDestroy() {}
}
