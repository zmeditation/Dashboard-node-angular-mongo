import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-full-width',
  templateUrl: './full-width.component.html'
})
export class SearchFullWidthComponent implements OnChanges {
  @Input()
  public isClear: boolean;

  @Output()
  public search = new EventEmitter();

  public value: string | number = '';

  ngOnChanges() {
    if (this.isClear) {
      this.value = '';
      this.search.emit({ value: this.value });
    }
  }

  public searchEvent(value: string): void {
    this.search.emit({ value });
  }

  public domainSearchEvent(event, value) {
    this.search.emit({value, endOfInput: true});
  }
}
