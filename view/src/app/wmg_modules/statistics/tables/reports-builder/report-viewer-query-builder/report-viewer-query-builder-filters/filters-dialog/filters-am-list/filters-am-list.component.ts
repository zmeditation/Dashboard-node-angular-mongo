import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FilterDialogService } from '../../../../../helpers/filter-dialog.service';

@Component({
  selector: 'app-filters-am-list',
  templateUrl: './filters-am-list.component.html',
  styleUrls: ['./filters-am-list.component.scss']
})
export class FiltersAmListComponent implements OnInit {
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
      if (el.id === element.value) { el.selected = !el.selected; }

    });
    setTimeout(() => {
      const parsedSelectionList = this.processSelectionListChanges(element.selectionList, this.filterListValues);
      this.filterDialogService.updateFilterDialogResults(parsedSelectionList);
    }, 0);
  }

  processSelectionListChanges(selectionListRef, filterListValuesArray): Array<any> {
    // const selected = selectionListRef.selectedOptions.selected.map((select) => select.value);

    const filtered = filterListValuesArray.filter((value) => value.selected);

    return filtered.map((value) => {
      return {
        name: value.name,
        value: value.id
      };
    });
  }

  processFiltersData(results): Array<any> {
    return results.map((result) => {
      return {
        name: result.manager,
        id: result._id,
        selected: false
      };
    });
  }

  deselectRemoved(value): void {
    this.filterListValues.forEach((listValue) => {
      if (listValue.id === value) { listValue.selected = false; }

    });

    const parsedSelectionList = this.processSelectionListChanges(this.filtersSelection, this.filterListValues);
    this.filterDialogService.updateFilterDialogResults(parsedSelectionList);
  }
}
