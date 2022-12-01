import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { egretAnimations } from 'shared/animations/egret-animations';

@Component({
  selector: 'app-vacant-properties',
  templateUrl: './vacant-properties.component.html',
  styleUrls: ['./vacant-properties.component.scss'],
  animations: egretAnimations
})
export class VacantPropertiesComponent implements OnInit, OnChanges {
  @Input() vacantProperties: Array<any> = [];

  public isLoading = true;

  public noData = true;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes): void {
    if (!this.vacantProperties.length) { this.noData = true; } 

    if (this.vacantProperties.length) { this.noData = false; } 

    if (changes.vacantProperties && !changes.vacantProperties.firstChange) { this.isLoading = false; } 

  }
}
