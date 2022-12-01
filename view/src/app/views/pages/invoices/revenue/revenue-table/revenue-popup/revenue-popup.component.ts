import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Revenue } from 'shared/interfaces/invoice.interface';
import { DeductionService } from '../../../../../../shared/services/cruds/deduction.service';
import { Deduction } from '../../../../../../shared/interfaces/reporting.interface';
import flow from 'lodash/fp/flow';
import toUpper from 'lodash/fp/toUpper';
import snakeCase from 'lodash/fp/snakeCase';

@Component({
  selector: 'app-revenue-popup',
  templateUrl: './revenue-popup.component.html',
  styleUrls: ['./revenue-popup.component.scss']
})
export class RevenuePopupComponent implements OnInit {
  detailedDeductions: Deduction[] = [];

  constructor(
    private deductionService: DeductionService,
    @Inject(MAT_DIALOG_DATA)
    public revenue: Revenue
  ) { }

  ngOnInit(): void {
    const query = {
      showDetailedDeductions: true,
      publishersId: [this.revenue.publisher],
      customRange: {
        dateFrom: this.revenue.begin,
        dateTo: this.revenue.end
      }
    };

    this.deductionService.getPublisherDeductions(query).subscribe(
      ({ publishers: [publisher] }) => {
        this.detailedDeductions = publisher?.deductions?.sort(
          (a, b) => a.deduction - b.deduction
        );
      }
    );
  }

  kebabToScreamingSnakeCase(key: string) {
    return flow(snakeCase, toUpper)(key);
  }
}
