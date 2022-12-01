import { Component, Input } from '@angular/core';
import { Publisher } from "shared/interfaces/common.interface";

@Component({
  selector: 'app-revenue-delete',
  templateUrl: './revenue-delete.component.html',
  styleUrls: ['./revenue-delete.component.scss']
})
export class RevenueDeleteComponent {

  mode = 'delete';

  @Input() publishersList: Publisher[];

  constructor() {}

}
