import { Component, ViewChild } from '@angular/core';
import { OrtbEndpointsService } from 'shared/services/cruds/ortb-endpoints.service';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SspEndpointComponent } from './ssp-endpoint/ssp-endpoint.component';

export type PartnersTableData = {
  id: number,
  name: string,
  secret_key?: string,
  enable?: boolean
}

@Component({
  selector: 'app-rtb-partners-list',
  templateUrl: './rtb-partners-list.component.html',
  styleUrls: ['./rtb-partners-list.component.scss']
})

export class RtbPartnersListComponent {

  private partnersType: 'SSP' | 'DSP';

  public tableSource: PartnersTableData[] = [];

  public tableData = new MatTableDataSource<PartnersTableData>(this.tableSource);

  public displayedColumns: string[];

  private subscriptions: Subscription = new Subscription();

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public OrtbEndpoints: OrtbEndpointsService,
    private EndpointDialog: MatDialog
  ) {
  }

  ngOnChanges() {
    this.updateTableData()
  }

  prepareTableData(tableSource: PartnersTableData[]) {
    return new MatTableDataSource(tableSource);
  }

  updateTableData(): void {
    this.displayedColumns = this.partnersType === 'SSP'
      ? ['id', 'name', 'enable', 'secret_key', 'generateEndpoint']
      : ['id', 'name']
    this.tableData = this.prepareTableData(this.tableSource);
  }

  getPartners(type: 'SSP' | 'DSP'): void {
    this.tableData = undefined;
    this.partnersType = type;
    const partnersSub = this.OrtbEndpoints[type]().subscribe((data: PartnersTableData[]) => {
      this.tableSource = data;
      this.updateTableData();
    })

    this.subscriptions.add(partnersSub);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
  }

  generateEndpoint(row: PartnersTableData): void {
    const token = btoa(`${ row.id }:${ row.secret_key }`);
    this.EndpointDialog.open(SspEndpointComponent, { width: '50%', data: token });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
