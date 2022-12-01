import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { IMatAutocompletePaginationData } from './interfaces/mat-autocomplete-pagination-data';

@Component({
  selector: 'app-mat-autocomplete-pagination',
  templateUrl: './mat-autocomplete-pagination.component.html',
  styleUrls: ['./mat-autocomplete-pagination.component.scss']
})
export class MatAutocompletePaginationComponent {
  public readonly PER_PAGE = 20;

  @ViewChild(MatAutocomplete, { static: true })
  public autocomplete!: MatAutocomplete;

  @Output()
  public readonly selected = new EventEmitter<MatAutocompleteSelectedEvent>();

  @Output()
  public readonly onLoadMore = new EventEmitter<undefined>();

  @Input()
  public load = false;

  @Input()
  public data: IMatAutocompletePaginationData = {
    list: [],
    pagination: { page: 1, total: 0 }
  };

  @Input()
  public disabledLoadMoreButton = false;

  @Input()
  public idProperty = '_id';

  public onSelect(event: MatAutocompleteSelectedEvent): void {
    this.selected.emit(event);
  }

  public loadMore(event: any) {
    event.stopPropagation();
    this.onLoadMore.emit(undefined)
  }

  get unloadedItems(): number {
    return this.data.pagination.total - this.data.list.length;
  }
}
