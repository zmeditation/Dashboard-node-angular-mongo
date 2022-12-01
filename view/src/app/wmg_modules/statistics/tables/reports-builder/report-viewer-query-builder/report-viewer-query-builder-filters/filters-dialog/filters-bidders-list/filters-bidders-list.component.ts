import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FilterDialogService } from '../../../../../helpers/filter-dialog.service';

@Component({
  selector: 'app-filters-bidders-list',
  templateUrl: './filters-bidders-list.component.html',
  styleUrls: ['./filters-bidders-list.component.scss']
})
export class FiltersBiddersListComponent implements OnInit {
  @Input() filterArr: any;

  @Input() toggledValue;

  @Input() searchValue: string;

  @ViewChild('filtersSelection') filtersSelection;

  filterListValues: Array<any>;

  constructor(private filterDialogService: FilterDialogService) {
    filterDialogService.removeFromResults$.subscribe((data) => {
      if (!data) { return; }
      this.deselectRemoved(data);
    });
  }

  ngOnInit() {
    this.filterListValues = this.processFiltersData(this.filterArr.results);
  }

  logSelection(element): void {
    this.filterListValues.forEach((el) => {
      if (el.id === element.value) {
        el.selected = !el.selected;
      }
    });
    setTimeout(() => {
      const parsedSelectionList = this.processSelectionListChanges(element.selectionList, this.filterListValues);
      this.filterDialogService.updateFilterDialogResults(parsedSelectionList);
    }, 0);
  }

  processSelectionListChanges(selectionListRef, filterListValuesArray): Array<any> {
    const filtered = filterListValuesArray.filter((value) => value.selected);
    return filtered.map((value) => {
      return {
        name: value.name,
        value: value.name
      };
    });
  }

  processFiltersData(results): Array<any> {
    return results.map((result) => {
      return {
        name: result.name,
        id: result.name,
        selected: false
      };
    });
  }

  deselectRemoved(value): void {
    this.filterListValues.forEach((listValue) => {
      if (listValue.id === value) {
        listValue.selected = false;
      }
    });

    const parsedSelectionList = this.processSelectionListChanges(this.filtersSelection, this.filterListValues);
    this.filterDialogService.updateFilterDialogResults(parsedSelectionList);
  }
}
