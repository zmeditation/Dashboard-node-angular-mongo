import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { egretAnimations } from './../../../animations/egret-animations';

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.scss'],
  animations: egretAnimations
})
export class UserOverviewComponent {
  constructor(public route: ActivatedRoute) {}
}
