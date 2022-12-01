import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-programmatics-reports-counts-table',
  templateUrl: './programmatics-reports-counts-table.component.html',
  styleUrls: ['programmatics-reports-counts-table.component.scss']
})
export class ProgrammaticsReportsCountsTableComponent {
  public displayedColumns = ['name', 'count'];

  @Input()
  public data = [];

  @Input()
  public totalReportsCount = 0;
}

