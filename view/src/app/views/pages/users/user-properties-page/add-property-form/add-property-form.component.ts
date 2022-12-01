import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface VacantProperties {
  _id: string;
  properties: Array<string>;
}
@Component({
  selector: 'app-add-property-form',
  templateUrl: './add-property-form.component.html',
  styleUrls: ['./add-property-form.component.scss']
})
export class AddPropertyFormComponent implements OnInit, OnChanges {
  @Input() vacantProperties: VacantProperties[] = [];

  public vacantPropertiesData: VacantProperties[] = [];

  @Input() displayedExpansionPanel;

  @Input() userId;

  @Input() propertiesAddForm;

  @Input() searchFormControl;

  @Input() originProps;

  filterIdProperty: Observable<VacantProperties[]>;

  filterOrigins: Observable<[]>;

  filterPlacements: Observable<[]>;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes): void {
    if (this.originProps) { this.autocompleteActivate(); } 

  }

  autocompleteActivate() {
    this.filterIdProperty = this.propertiesAddForm.get('property_id').valueChanges.pipe(
      startWith(''),
      map((value: string) => (typeof value === 'string' ? value : '')),
      map((filter: string) => this._filterPublisher(filter))
    );
    this.filterOrigins = this.propertiesAddForm.get('property_origin').valueChanges.pipe(
      startWith(''),
      map((value: string) => (typeof value === 'string' ? value : '')),
      map((filter: string) => this._filterOrigin(filter))
    );
    this.filterPlacements = this.propertiesAddForm.get('placement_name').valueChanges.pipe(
      startWith(''),
      map((value: string) => (typeof value === 'string' ? value : '')),
      map((filter: string) => this._filterPlacements(filter))
    );
  }

  private _filterPublisher(value: string): VacantProperties[] {
    const vacant = JSON.parse(JSON.stringify(this.vacantPropertiesData));
    return vacant.filter((obj: VacantProperties) => {
      return (obj.properties = obj.properties.filter((string) => {
        return string.toLowerCase().includes(value.toLowerCase()) === true;
      }));
    });
  }

  private _filterPlacements(value: string): VacantProperties[] {
    const vacant = this.displayedExpansionPanel.map((el) => {
      return el.name;
    });
    return vacant.filter((string) => {
      return string.toLowerCase().includes(value.toLowerCase()) === true;
    });
  }

  private _filterOrigin(value: string): VacantProperties[] {
    const vacant = this.originProps;
    return vacant.filter((string) => {
      return string.toLowerCase().includes(value.toLowerCase()) === true;
    });
  }

  getValueOrigin(value: string) {
    this.propertiesAddForm.get('property_id').reset();
    this.propertiesAddForm.get('placement_name').reset();
    this.vacantPropertiesData = this.vacantProperties.filter((obj: VacantProperties) => {
      if (obj._id === value && obj.properties.length) { return obj; } 

    });
    this.propertiesAddForm.patchValue({ property_id: '' });
  }
}
