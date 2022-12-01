import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { CrudService } from '../../services/crud.service';
import { catchError, map, startWith } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { AnalyticsAdapterSettingsDialogComponent } from "./analytics-adapter-settings-dialog.component";

// export interface DialogData {
//     adapter: { name: string, options: Object, savedOptions: Object };
// }

@Component({
  selector: 'app-analytics-select',
  templateUrl: './analytics-select.component.html',
  styleUrls: ['./analytics-select.component.scss']
})
export class AnalyticsSelectComponent implements OnInit, OnChanges, OnDestroy {
  mainFormDisabled: boolean;

  selectable = true;

  removable = true;

  addOnBlur = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  analyticsControl = new FormControl(null, Validators.required);

  filteredAnalyticsAdapters: Observable<string[]>;

  analyticsAdapters: string[] = [];

  allAnalyticsAdapters: string[] = [];

  emitter = new EventEmitter();

  exAnalyticsAdapters: string[];

  removed: string;

  private unsubscribe$ = new Subject();

  settings: any;

  savedOptions: any;

  @ViewChild('adapterInput') adapterInput: ElementRef<HTMLInputElement>;

  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger) inputAutoComplete: MatAutocompleteTrigger;

  @Input() existAnalyticsAdapters: string[] | any;

  @Input() isPrebidUser: boolean;

  @Input() disabledForm: boolean;

  @Output() changeAnalyticsList = new EventEmitter();

  @Output() sendOptions = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    if (changes.existAnalyticsAdapters && changes.existAnalyticsAdapters.firstChange) {
      this.exAnalyticsAdapters = [...changes.existAnalyticsAdapters.currentValue];
    } else if (changes.existAnalyticsAdapters && !changes.existAnalyticsAdapters.firstChange) {
      const diff: string = this.exAnalyticsAdapters.filter((x) => !changes.existAnalyticsAdapters.currentValue.includes(x)).toString();
      this.emitter.emit({ type: 'remove', adapter: diff });
      this.exAnalyticsAdapters = [...changes.existAnalyticsAdapters.currentValue];
    }

    // if preview mode ON and main form disabled
    if (changes.disabledForm && changes.disabledForm.currentValue === true) {
      this.mainFormDisabled = true;
      this.analyticsControl.disable();
      this.analyticsControl.updateValueAndValidity();
      this.removable = false;
      if (this.inputAutoComplete) {
        this.inputAutoComplete.setDisabledState(true);
        this.inputAutoComplete.autocompleteDisabled = true;
      }
      if (this.adapterInput) {
        this.adapterInput.nativeElement.disabled = true;
        this.adapterInput.nativeElement.style.cursor = 'default';
      }
    }
  }

  constructor(private crudService: CrudService, public dialog: MatDialog) {
    this.filteredAnalyticsAdapters = this.analyticsControl.valueChanges.pipe(
      startWith(null),
      map((adapter: string | null) => (adapter ? this._filter(adapter) : this.allAnalyticsAdapters.slice()))
    );
  }

  async ngOnInit() {
    this.crudService
      .getAnalyticsList()
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return Observable.throwError(err);
        })
      )
      .takeUntil(this.unsubscribe$)
      .subscribe(
        (data: string[]) => {
          this.allAnalyticsAdapters = data;
          if (this.existAnalyticsAdapters) {
            this.existAnalyticsAdapters.forEach((adapter: string) => {
              const index: number = this.allAnalyticsAdapters.indexOf(adapter);
              if (index > -1) { this.allAnalyticsAdapters.splice(index, 1); }

            }); 
          }


          this.analyticsControl.setValue(null);
        },
        (err) => {
          console.error(err.error);
        }
      );

    this.emitter.subscribe((event) => {
      if (event.type === 'add') {
        const index: number = this.allAnalyticsAdapters.indexOf(event.adapter);
        if (index !== -1) { this.allAnalyticsAdapters.splice(index, 1); }

        this.analyticsControl.setValue(null);
        this.allAnalyticsAdapters = [...this.allAnalyticsAdapters];
      } else if (event.type === 'remove') {
        this.allAnalyticsAdapters.push(event.adapter);
        this.allAnalyticsAdapters = this.allAnalyticsAdapters.sort();
        this.allAnalyticsAdapters = Array.from(new Set(this.allAnalyticsAdapters));
        this.analyticsControl.setValue(null);
        this.allAnalyticsAdapters = [...this.allAnalyticsAdapters];
        if (this.savedOptions && this.savedOptions[event.adapter]) {
          delete this.savedOptions[event.adapter];
          this.sendOptions.emit(this.savedOptions);
        }
      }

      if (this.analyticsAdapters.length !== 0) { this.getAnalyticsSettings(this.analyticsAdapters); } else { this.settings = []; }


      this.changeAnalyticsList.emit(this.analyticsAdapters);
    });
  }

  openPanel(event: Event): void {
    event.stopPropagation();
    if (this.mainFormDisabled === true) {
      this.inputAutoComplete.setDisabledState(true);
      return;
    }
    this.inputAutoComplete.openPanel();
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) { this.analyticsAdapters.push(value.trim()); }


      if (input) { input.value = ''; }


      this.emitter.emit({ type: 'add', adapter: value.trim() });
      this.analyticsControl.setValue(null);
    }
  }

  remove(adapter: string): void {
    this.removed = adapter;
    const index = this.analyticsAdapters.indexOf(adapter);
    if (index >= 0) { this.analyticsAdapters.splice(index, 1); }

    this.analyticsAdapters = [...this.analyticsAdapters];
    this.emitter.emit({ type: 'remove', adapter });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.analyticsAdapters.push(event.option.viewValue);
    this.adapterInput.nativeElement.value = '';
    this.analyticsControl.setValue(null);
    this.emitter.emit({ type: 'add', adapter: event.option.viewValue });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allAnalyticsAdapters.filter((adapter) => adapter.toLowerCase().indexOf(filterValue) === 0);
  }

  getAnalyticsSettings(analyticsAdapters): void {
    this.crudService
      .getAnalyticsSettings(analyticsAdapters)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return Observable.throwError(err);
        })
      )
      .takeUntil(this.unsubscribe$)
      .subscribe(
        (data: any[]) => {
          this.settings = data;
        },
        (err) => {
          console.error(err.error || err);
        }
      );
  }

  setAnalyticsSettings(adapter: string): void {
    let currentSettings: any = '';

    this.settings.forEach((set) => {
      if (set.code === adapter) { return (currentSettings = set); }

    });

    if (currentSettings.options) {
      Object.entries(currentSettings.options).forEach((option: any) => {
        if (this.savedOptions && this.savedOptions[adapter]) {
          for (const opt of this.savedOptions[adapter]) {
            for (const o in opt) { if (o === option[0]) { option[1].value = opt[o]; } }


          } 
        } else { option[1].value = ''; }

      }); 
    }


    const openDialog = this.dialog.open(AnalyticsAdapterSettingsDialogComponent, {
      data: {
        adapter: {
          name: adapter,
          options: Object.entries(currentSettings.options)
        }
      }
    });

    openDialog
      .afterClosed()
      .takeUntil(this.unsubscribe$)
      .subscribe((data) => {
        this.savedOptions = this.savedOptions ? Object.assign(this.savedOptions, data) : Object.assign({}, data);
        this.sendOptions.emit(this.savedOptions);
      });
  }

  checkOptions(adapter: string): boolean {
    let length = 0;
    if (this.settings) {
      this.settings.forEach((set) => {
        if (set.code === adapter) { length = Object.keys(set.options).length; }

      }); 
    }


    return length > 0;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
