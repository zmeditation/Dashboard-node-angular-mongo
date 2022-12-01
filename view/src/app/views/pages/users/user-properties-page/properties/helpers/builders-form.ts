import { GetDataForPanels } from './get-data-for-panels';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTransitionService } from '../../../_services-and-helpers/data-transition.service';
import { CrudService } from 'shared/services/cruds/crud.service';
import { HttpClient } from '@angular/common/http';

export class BuildersForm extends GetDataForPanels {
  public propertiesForm: FormGroup;

  public propertiesAddForm: FormGroup;

  public propertyObject = {
    property_id: '',
    placement_name: '',
    property_description: '',
    property_origin: '',
    _id: ''
  };

  public warnClass = {
    color: 'red'
  };

  searchFormControl = new FormControl();

  public filteredProperties;

  public showClearButton = false;

  public originProps;

  constructor(
    public fb: FormBuilder,
    public crudService: CrudService,
    public transitServiceHelp: DataTransitionService,
    public http: HttpClient
  ) {
    super(transitServiceHelp, http, crudService);
  }

  buildPropertiesForm(property?) {
    this.propertiesForm = this.fb.group({
      placement_name: [this.propertyObject.placement_name || '', Validators.required],
      property_id: [this.propertyObject.property_id || '', Validators.required],
      property_description: [this.propertyObject.property_description || '', Validators.maxLength(150)],
      property_origin: [this.propertyObject.property_origin, Validators.required],
      _id: [this.propertyObject._id, Validators.required]
    });
    if (property) {
      this.propertiesForm = this.fb.group({
        placement_name: [property.placement_name || '', Validators.required],
        property_id: [property.property_id || '', Validators.required],
        property_description: [property.property_description || ''],
        property_origin: [property.property_origin, Validators.required],
        _id: [property._id, Validators.required]
      });
    }


  }

  buildPropertiesAddForm() {
    this.propertiesAddForm = this.fb.group({
      placement_name: ['', [Validators.required, Validators.pattern(/[\d{2,3}x\d{2,3}_A-z.?]|[A-z.?]/gi)]],
      property_id: ['', Validators.required],
      property_description: ['', Validators.maxLength(150)],
      property_origin: ['', Validators.required]
    });
  }

  getOriginProps() {
    this.crudService.getOriginProperties().subscribe((origin) => {
      this.originProps = origin.results.filter((el) => el !== 'Google Ad Manager Commission');
    });
  }
}
