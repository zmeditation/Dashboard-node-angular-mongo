import { Component, Input } from '@angular/core';
import { Publisher } from "shared/interfaces/common.interface";

@Component({
  selector: 'app-revenue-force-update',
  templateUrl: './revenue-force-update.component.html',
  styleUrls: ['./revenue-force-update.component.scss']
})
export class RevenueForceUpdateComponent {

  mode = 'update';

  @Input() publishersList: Publisher[];

  constructor() {}

}
