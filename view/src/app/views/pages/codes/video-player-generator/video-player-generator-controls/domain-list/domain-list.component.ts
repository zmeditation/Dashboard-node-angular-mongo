import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { simpleUrlRegExp } from '../utils/simple-url-check';
import { TranslateService } from '@ngx-translate/core';

const SNACKBAR_LIFETIME = 3000;

@Component({
  selector: 'app-generator-domains',
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.scss']
})
export class DomainListComponent implements OnInit, OnChanges {
  public readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  public selected = new Set<string>([]);

  public filtered = new Observable<string[]>();

  @Input()
  public control!: FormControl;

  @Input()
  public list = [];

  @Input()
  public loaded = false;

  @Output()
  public readonly onSelect = new EventEmitter<string[]>();

  constructor(private snackBar: MatSnackBar, private translate: TranslateService) {
    // Empty
  }

  public ngOnInit(): void {
    this.filtered = this.control.valueChanges.pipe(
      startWith<string>(''),
      map((filter) => this.filterDomains(filter))
    );
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.list !== undefined && changes.list.currentValue !== changes.list.previousValue) {
      this.control.setValue(null);

      if (changes.list.currentValue.length === 0) {
        this.clearDomains();
        this.control.reset();
      }
    }
  }

  public selectAllDomains(): void {
    this.selectDomain(this.list);
    this.control.setValue(null);
  }

  public deselectAllDomains(): void {
    this.clearDomains();
    this.control!.reset();
  }

  public toggleDomain(domain: string): void {
    const { selected } = this;
    if (selected.has(domain)) { this.deselectDomain(domain); } else { this.selectDomain(domain); } 
    
    this.control.setValue('');
  }

  public filterDomains(filter: string): string[] {
    if (!filter) { return this.list; } 
    

    return this.list.filter((domain: string) => domain.indexOf(filter) > -1);
  }

  public get selectedDomains(): string[] {
    return Array.from(this.selected);
  }

  public createDomain(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim() || '';

    if (!simpleUrlRegExp.test(value)) {
      const text = this.translate.instant('VALIDATION_ERRORS.ONLY_SHORT_URL');
      this.snackBar.open(text, undefined, {
        panelClass: 'warn',
        duration: SNACKBAR_LIFETIME
      });
      return;
    }

    if (value) { this.selectDomain(value); } 
    

    if (input) { input.value = ''; } 
    

    this.control.reset(undefined);
  }

  /** CONTROLS */
  private selectDomain(domain: string | string[]): void {
    if (Array.isArray(domain)) { this.selected = new Set(domain); } else { this.selected.add(domain); } 
    

    this.onSelect.emit(this.selectedDomains);
  }

  private deselectDomain(domain: string): void {
    this.selected.delete(domain);
    const selectedList = this.selectedDomains;
    if (!selectedList.length) { this.control!.reset(); } 
    
    this.onSelect.emit(this.selectedDomains);
  }

  private clearDomains(): void {
    this.selected.clear();
    this.onSelect.emit([]);
  }
}
