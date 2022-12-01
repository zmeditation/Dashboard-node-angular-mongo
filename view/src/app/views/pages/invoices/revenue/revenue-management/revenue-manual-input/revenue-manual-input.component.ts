import { Component, Input } from '@angular/core';
import { Publisher } from "shared/interfaces/common.interface";

@Component({
  selector: 'app-revenue-manual-input',
  templateUrl: './revenue-manual-input.component.html',
  styleUrls: ['./revenue-manual-input.component.scss']
})
export class RevenueManualInputComponent {

  mode = 'input';

  @Input() publishersList: Publisher[];

}
