import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportsUsersToolsComponent } from './reports/reports.component';
import { ToolsHelperService } from '../_services-and-helpers/tools-helper.service';

@Component({
  selector: 'app-users-tools',
  templateUrl: './users-tools.component.html',
  styleUrls: ['./users-tools.component.scss']
})
export class UsersToolsComponent extends ToolsHelperService implements OnInit {
  @ViewChild(ReportsUsersToolsComponent)
  protected reportsUsersToolsComponent: ReportsUsersToolsComponent;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  public onTabChange(event: { index: number }): void {
    if (event.index === 2) {
      this.reportsUsersToolsComponent.loadUsers();
    }
  }
}
