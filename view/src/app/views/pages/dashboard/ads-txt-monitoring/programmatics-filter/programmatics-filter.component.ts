import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import AdstxtAll from '../services/adstxt.json';
import { egretAnimations } from 'shared/animations/egret-animations';

@Component({
  selector: 'app-programmatics-filter',
  templateUrl: './programmatics-filter.component.html',
  styleUrls: ['./programmatics-filter.component.scss'],
  animations: egretAnimations
})
export class ProgrammaticsFilterComponent implements OnInit, OnChanges {
  @Input() list;

  public originsSelected: Array<string> = Object.keys(AdstxtAll);

  public searchPub: Array<string> = Object.keys(AdstxtAll);

  public searchBy: Array<any> = Object.entries(AdstxtAll);

  public originsUnSelected: Array<string> = [];

  public originsList: Array<any> = [{ name: 'All', checked: true }];

  public isReady = false;

  formFilter: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formFilter = fb.group({
      origins: []
    });
  }

  ngOnInit() {
    this.createList();
  }

  ngOnChanges(changes): void {
    this.isReady = this.list.length > 0;
    setTimeout(() => (this.isReady = this.list.length > 0), 1000);
  }

  createList() {
    for (const i of this.originsSelected) { this.originsList.push({ name: i, checked: true }); }

    this.originsList.push({ name: 'yandex', checked: true });
    this.originsSelected.unshift('All');
    this.originsSelected.push('yandex');
  }

  selected(value) {
    value.checked = !value.checked;

    if (!this.originsSelected.includes(value.name) && value.name !== 'All') {
      this.originsSelected.push(value.name);
      this.originsUnSelected.splice(this.originsUnSelected.indexOf(value.name), 1);
    } else if (this.originsSelected.includes(value.name) && value.name !== 'All') {
      this.originsSelected.splice(this.originsSelected.indexOf(value.name), 1);
      this.originsUnSelected.push(value.name);
      this.originsList[0].checked = false;
      if (this.originsSelected.includes('All')) {
        this.originsSelected.splice(this.originsSelected.indexOf('All'), 1);
        this.originsUnSelected.push('All');
      }
    } else if (value.name === 'All' && value.checked === true) {
      this.originsSelected = [];
      this.originsUnSelected = [];

      for (const i of this.originsList) {
        i.checked = true;
        this.originsSelected.push(i.name);
      }
    } else if (value.name === 'All' && value.checked === false) {
      this.originsUnSelected = [];
      this.originsSelected = [];

      for (const i of this.originsList) {
        i.checked = false;
        this.originsUnSelected.push(i.name);
      }
    }
    this.formFilter.get('origins').setValue(this.originsSelected);
    this.selectDataWithFilter(this.formFilter.get('origins').value, this.originsUnSelected);
  }

  resetChip() {
    for (const i of this.originsList) {
      i.checked = false;
    }

    this.originsSelected = [];
    this.originsUnSelected = [];
    this.formFilter.get('origins').setValue(this.originsSelected);
    this.selectDataWithFilter(this.formFilter.get('origins').value, this.originsUnSelected);
  }

  async csvDownload() {
    const text = 'Partner,Partner+Subpartner,ID number,Relationships,Unique Number\n';
    const csvReturn = (c, v, k) => {
      if (v.length === 0) { return; }
      if (this.searchPub.includes(k)) {
        c += '\n';
        v.forEach((el, i) => {
          if (i === 0) {
            c += k.toUpperCase() + ',';
          } else if (i > 0) {
            c += ',';
          }
          c += Object.values(el) + '\n';
        });
      }
      return c;
    };
    const makeCsv = (csv) => {
      for (const [key, val] of this.searchBy) {
        csvReturn(csv, key, val);
      }
    };

    const csvResult = await makeCsv(text);

    const hiddenElement = document.createElement('a');
    // @ts-ignore
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvResult);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'ads.csv';
    hiddenElement.click();
  }

  selectDataWithFilter(dataOn, dataOff?) {
    this.searchPub = dataOn;
    for (const pub of this.list) {
      if (dataOff.length > 0) {
        for (const domain of pub.domains) {
          domain.origins.forEach((el) => {
            Object.keys(el).forEach((str) => {
              str = str === 'google ad manager' || str === 'google ad manager hb' ? 'google' : str.toLowerCase();
              if (dataOff.includes(str)) { pub.isShow = false; }

            });
          });
        }
      }


      if (dataOn.length > 0) {
        for (const domain of pub.domains) {
          domain.origins.forEach((el) => {
            Object.keys(el).forEach((str) => {
              str = str === 'google ad manager' || str === 'google ad manager hb' ? 'google' : str.toLowerCase();
              if (dataOn.includes(str)) { pub.isShow = true; }

            });
          });
        }
      }


      if (dataOn.length === 0 && dataOff.length === 0) { pub.isShow = false; }

    }
  }
}
