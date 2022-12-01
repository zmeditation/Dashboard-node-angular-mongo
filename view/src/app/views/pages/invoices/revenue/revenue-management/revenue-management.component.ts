import { Component, Input, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { User } from "shared/interfaces/users.interface";
import { Publisher } from "shared/interfaces/common.interface";
import { CrudService } from 'shared/services/cruds/crud.service';

@Component({
  selector: 'app-revenue-management',
  templateUrl: './revenue-management.component.html',
  styleUrls: ['./revenue-management.component.scss']
})
export class RevenueManagementComponent {

  @ViewChild(MatTabGroup, { static: false }) tabGroup: MatTabGroup;

  @Input() user: User;

  @Input() publishersList: Publisher[];

  constructor(private crudService: CrudService) {
  }

  async rewriteSelectedRevenues(date) {
    this.crudService.rewriteRevenues({ date }).subscribe(data => console.log(data));
  }

}
