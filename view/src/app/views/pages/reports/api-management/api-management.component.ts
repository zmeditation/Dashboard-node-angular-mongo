import { Component, OnInit } from "@angular/core";
import { egretAnimations } from 'shared/animations/egret-animations';

@Component({
  selector: "app-api-management",
  templateUrl: "./api-management.component.html",
  styleUrls: ["./api-management.component.scss"],
  animations: egretAnimations
})
export class ApiManagementComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
