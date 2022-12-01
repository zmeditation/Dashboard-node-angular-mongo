import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { egretAnimations } from '../../../../../shared/animations/egret-animations';

@Component({
  selector: 'app-table-statistics-domains',
  templateUrl: './table-statistics-domains.component.html',
  styleUrls: ['./table-statistics-domains.component.scss'],
  animations: egretAnimations
})
export class TableStatisticsDomainsComponent implements OnInit, OnChanges {
  dataSource = {};

  displayedColumns = ['publishers', 'domains', 'passed_the_test', 'not_passed_the_test', 'no_adstxt'];

  @Input() checkedDomains;

  @Input() lastUpdate;

  constructor() {}

  ngOnInit() {
    this.buildDataTable();
  }

  ngOnChanges(changes) {
    this.buildDataTable();
  }

  buildDataTable() {
    const allQuantities = [
      {
        publishers: this.quantityPublishers.publishers,
        domains: this.quantityDomains.domains,
        passed_the_test: this.quantityPassedDomains.passed_the_test,
        not_passed_the_test: this.quantityNotPassedDomains.not_passed_the_test,
        no_adstxt: this.quantityNoAdstxtDomains.no_adstxt
      }
    ];
    this.dataSource = new MatTableDataSource(allQuantities);
  }

  get quantityPublishers() {
    return { publishers: this.checkedDomains.length };
  }

  get quantityDomains() {
    const domains = [];
    this.checkedDomains.forEach((e) => {
      e.domains.forEach((dom) => {
        domains.push(dom);
      });
    });
    return { domains: domains.length };
  }

  get quantityPassedDomains() {
    const passedDomains = [];
    this.checkedDomains.forEach((e) => {
      e.domains.forEach((check) => {
        check.checked === 'true' ? passedDomains.push(check.checked) : '';
      });
    });
    return { passed_the_test: passedDomains.length };
  }

  get quantityNotPassedDomains() {
    const notPassedDomains = [];
    this.checkedDomains.forEach((e) => {
      e.domains.forEach((check) => {
        check.checked === 'false' ? notPassedDomains.push(check.checked) : '';
      });
    });
    return { not_passed_the_test: notPassedDomains.length };
  }

  get quantityNoAdstxtDomains() {
    const noAdstxt = [];
    this.checkedDomains.forEach((e) => {
      e.domains.forEach((dom) => {
        dom.adsTxt === 'false' || dom.adsTxt === 'undefined' ? noAdstxt.push(dom.adsTxt) : '';
      });
    });
    return { no_adstxt: noAdstxt.length };
  }
}
