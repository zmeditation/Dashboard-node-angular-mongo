import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subject } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { CrudService } from '../../services/crud.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddMarketplaceDialogComponent } from "./add-marketplace-dialog.component";

export interface Options {
  option: string;
  required: boolean;
  show?: boolean;
  type: string;
  example: string;
  description: string;
}

export interface Setting {
  GDPR?: boolean;
  code: string;
  hasNonRequired?: boolean;
  media_types?: string[];
  name: string;
  options: Options[];
}

@Component({
  selector: 'app-adapters-select-component',
  templateUrl: 'adapters-select.component.html',
  styleUrls: ['adapters-select.component.scss']
})
export class AdaptersSelectComponent implements OnInit, OnChanges, OnDestroy {
  mainFormDisabled = false;

  removable = true;

  addOnBlur = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  adapterCtrl = new FormControl({ disabled: this.mainFormDisabled }, Validators.required);

  filteredAdapters: Observable<string[]>;

  adapters: string[] = [];

  allAdapters: string[] = [];

  emitter = new EventEmitter();

  settings: any = [];

  toAllToggle = false;

  floorPriceValue: number | string;

  exAdapters: string[];

  clicked: boolean;

  removed: string;

  private unsubscribe$ = new Subject();

  marketplaceSettings: any;

  perm: string[];

  @ViewChild('adapterInput') adapterInput: ElementRef<HTMLInputElement>;

  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger) inputAutoComplete: MatAutocompleteTrigger;

  @Input() toAll: any;

  @Input() existAdapters: string[];

  @Input() isPrebidUser: boolean;

  @Input() disabledForm: boolean;

  @Output() changeAdaptersList = new EventEmitter();

  @Output() getMarketplaceSettings = new EventEmitter();

  static assignAdaptersSettings(html: HTMLElement): any | null {
    if (!html.querySelector('#adapter-settings')) { return null; }

    const settings = {};
    const element: HTMLElement = html.querySelector('#adapter-settings');
    const setOfSettings: HTMLCollectionOf<Element> = element.getElementsByClassName('adapter-settings-block');
    for (const set of (setOfSettings as unknown) as any[]) {
      const adapter = set.getElementsByTagName('mat-panel-title');
      const adapterID = adapter[0].id;
      settings[adapterID] = {};
      const obj = {};
      const thisSettings: HTMLCollectionOf<Element> = set.getElementsByClassName('adapter-settings-main');
      for (const s of (thisSettings as unknown) as any[]) {
        if (!s.getElementsByTagName('input')[0]) { continue; }

        const option = s.getElementsByTagName('input')[0].placeholder;
        const value = s.getElementsByTagName('input')[0].value;
        const type = s.querySelector('.second-row > span').textContent;
        obj[option] = { data: value, type };
        Object.assign(settings[adapterID], obj);
      }
    }
    return settings;
  }

  ngOnChanges(changes: SimpleChanges) {
    // check if selected option "apply floor price to all"
    if (changes.toAll && changes.toAll.currentValue && changes.toAll.currentValue.checked) {
      this.toAllToggle = true;
      this.floorPriceValue = changes.toAll.currentValue.value;
    } else {
      this.toAllToggle = false;
    }

    // check if list of exist Adapters changed
    if (changes.existAdapters && changes.existAdapters.firstChange) {
      this.exAdapters = [...changes.existAdapters.currentValue];
    } else if (changes.existAdapters && !changes.existAdapters.firstChange) {
      const diff: string = this.exAdapters.filter((x) => !changes.existAdapters.currentValue.includes(x)).toString();
      this.emitter.emit({ type: 'remove', adapter: diff });
      this.exAdapters = [...changes.existAdapters.currentValue];
    }

    // if preview mode ON and main form disabled
    if (changes.disabledForm && changes.disabledForm.currentValue === true) {
      this.mainFormDisabled = true;
      this.adapterCtrl.disable();
      this.adapterCtrl.updateValueAndValidity();
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

  constructor(private crudService: CrudService, public dialog: MatDialog, public NgxPermissionsS: NgxPermissionsService) {
    this.filteredAdapters = this.adapterCtrl.valueChanges.pipe(
      startWith(null),
      map((adapter: string | null) => (adapter ? this._filter(adapter) : this.allAdapters.slice()))
    );
  }

  async ngOnInit() {
    this.perm = Object.keys(this.NgxPermissionsS.getPermissions());
    this.crudService
      .getAllAdapters()
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return Observable.throwError(err);
        })
      )
      .takeUntil(this.unsubscribe$)
      .subscribe(
        (data: any) => {
          this.allAdapters = data;
          if (this.existAdapters) { this.allAdapters = this.allAdapters.filter((adapter) => !this.existAdapters.includes(adapter)); }


          this.adapterCtrl.setValue(null);
        },
        (err) => {
          console.error(err.error);
        }
      );
    this.emitter.subscribe((event) => {
      if (event.type === 'add' && event.adapter === 'WMG Marketplace') {
        const dialogRef = this.dialog.open(AddMarketplaceDialogComponent);
        dialogRef.afterClosed().subscribe((form: any) => {
          const settings = AdaptersSelectComponent.assignAdaptersSettings(form);
          this.inputAutoComplete.closePanel();
          return this.getMarketplaceSettings.emit({
            adapters: Object.keys(settings),
            settings
          });
        });
      }
      if (event.type === 'add') {
        const index = this.allAdapters.indexOf(event.adapter);
        if (index !== -1) { this.allAdapters.splice(index, 1); }

        this.adapterCtrl.setValue(null);
        this.allAdapters = [...this.allAdapters];
      } else if (event.type === 'remove') {
        this.allAdapters.push(event.adapter);
        this.allAdapters = this.allAdapters.sort();
        this.allAdapters = Array.from(new Set(this.allAdapters));
        this.adapterCtrl.setValue(null);
        this.allAdapters = [...this.allAdapters];
      }
      if (this.adapters.length !== 0) { this.getSettings(this.adapters); } else { this.settings = []; }

      this.changeAdaptersList.emit(this.adapters);
    });

    this.clicked = false;
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

      if ((value || '').trim()) { this.adapters.push(value.trim()); }


      if (input) { input.value = ''; }


      this.emitter.emit({ type: 'add', adapter: value.trim() });
      this.adapterCtrl.setValue(null);
    }
  }

  remove(adapter: string): void {
    this.removed = adapter;
    const index = this.adapters.indexOf(adapter);
    if (index >= 0) { this.adapters.splice(index, 1); }

    this.adapters = [...this.adapters];
    this.emitter.emit({ type: 'remove', adapter });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.adapters.push(event.option.viewValue);
    this.adapterInput.nativeElement.value = '';
    this.adapterCtrl.setValue(null);
    this.emitter.emit({ type: 'add', adapter: event.option.viewValue });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allAdapters.filter((adapter) => adapter.toLowerCase().indexOf(filterValue) === 0);
  }

  getSettings(adapters): void {
    this.crudService
      .getSettings(adapters)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return Observable.throwError(err);
        })
      )
      .takeUntil(this.unsubscribe$)
      .subscribe(
        (data: any) => {
          if (this.settings.length === 0) {
            this.settings = data;
          } else if (data.length > this.settings.length) {
            const diff1 = this.settings.reduce((a, { name }) => Object.assign(this.settings, { [name]: name }), {});
            const diff2 = data.reduce((a, { name }) => Object.assign(data, { [name]: name }), {});
            const diff = [...this.settings.filter(({ name }) => !diff2[name]), ...data.filter(({ name }) => !diff1[name])];
            this.settings = this.settings.concat(diff);
          } else {
            this.settings.forEach((setting, index) => {
              if (setting.code === this.removed) { this.settings.splice(index, 1); }

            });
          }
        },
        (err) => {
          console.error(err.error || err);
        }
      );
  }

  showNonRequired(set: string): void {
    this.settings.forEach((s: Setting) => {
      if (s.code === set) {
        s.options.forEach((st) => {
          if (!st.required) { st.show = !st.show; }

        });
      }


    });

    this.clicked = !this.clicked;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
