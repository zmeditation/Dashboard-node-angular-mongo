import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReportViewerQueryBuilderService } from '../../../helpers/report-viewer-query-builder.service';
import { Subscription } from 'rxjs/Rx';
import { FormDimensionsType } from 'shared/types/reports';

@Component({
  selector: 'app-report-viewer-query-builder-dimensions',
  templateUrl: './report-viewer-query-builder-dimensions.component.html',
  styleUrls: ['./report-viewer-query-builder-dimensions.component.scss']
})
export class ReportViewerQueryBuilderDimensionsComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();

  @Input() initialDimensionsArray: Array<FormDimensionsType>;

  @Input() isCommissionOn?;

  allowed: Array<string> = ['daily', 'monthly', 'day', 'month'];

  values = {
    daily: {
      name: 'Daily',
      value: 'daily',
      selected: false
    },
    monthly: {
      name: 'Monthly',
      value: 'monthly',
      selected: false
    },
    month: {
      name: 'Monthly',
      value: 'month',
      selected: false
    },
    day: {
      name: 'Daily',
      value: 'day',
      selected: false
    }
  };

  selectedDimensions: Array<FormDimensionsType> = [];

  intervalObject: any;

  constructor(private queryBuilderService: ReportViewerQueryBuilderService) {}

  ngOnInit() {
    this.initListeners();
  }

  private initListeners(): void {
    const subInterval = this.queryBuilderService.intervalListener$
      .subscribe((value) => this.intervalHandler(value));
    this.subscriptions.add(subInterval);

    const subCommission = this.queryBuilderService.isCommissionOptionOn$
      .subscribe((opt) => this.isCommissionOn = opt);
    this.subscriptions.add(subCommission);
  }

  intervalHandler(value): void {
    if (this.isCommissionOn) { this.selectedDimensions = []; }

    if (this.checkIfAllowed(this.allowed, value)) {
      if (this.hasInterval()) {
        this.selectedDimensions.forEach((dimension, index) => {
          if (this.checkIfAllowed(this.allowed, dimension.value)) {
            this.selectedDimensions.splice(index, 1);
            this.intervalObject = undefined;
          }
        });
      }


      this.selectedDimensions = [this.values[value], ...this.selectedDimensions];
      this.intervalObject = this.values[value];
    } else {
      this.selectedDimensions.forEach((dimension, index) => {
        if (this.checkIfAllowed(this.allowed, dimension.value)) {
          this.selectedDimensions.splice(index, 1);
          this.intervalObject = undefined;
        }
      });
    }
    const dimensionValues = this.selectedDimensions.map((dimension) => dimension.value);
    if (this.isCommissionOn) { dimensionValues.push('domain'); }

    this.queryBuilderService.sendDimensionsForm(dimensionValues);
  }

  logDimensionSelection(dimensionsSelection, i): void {
    const selected = dimensionsSelection.selectedOptions.selected.map((select) => select.value);

    this.selectedDimensions = this.createDimensionsArray(this.intervalObject, selected);

    const dimensionValues = this.selectedDimensions.map((dimension) => dimension.value);

    this.queryBuilderService.sendDimensionsForm(dimensionValues);
  }

  createDimensionsArray(intervalObject, selected): Array<any> {
    let filteredDimensions = this.initialDimensionsArray.filter((dimension) => selected.includes(dimension.value));

    if (intervalObject) { filteredDimensions = [intervalObject, ...filteredDimensions]; }


    return filteredDimensions;
  }

  hasInterval(): boolean {
    const allowed: Array<string> = ['daily', 'monthly', 'day', 'month'];

    for (const dimension of this.selectedDimensions) { if (this.checkIfAllowed(allowed, dimension.value)) { return true; } }


    return false;
  }

  checkIfAllowed(allowedArray: Array<string>, value: string): boolean {
    return allowedArray.includes(value);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
