import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ApiHttpService } from './api-http.service';

export class ApiFormBuilder {
  public apiUploadForm: FormGroup;

  public programmaticsList = [];

  public SubscriptionsList: Subscription[] = [];

  public unavailabilityRange = {
    max: new Date(new Date().setDate(new Date().getDate() - 1)),
    day: Infinity,
    minPermanent: new Date('2018-12-01'),
    maxPermanent: new Date(new Date().setDate(new Date().getDate() - 1)),

    get min(): any {
      const range = new Date(this.max);
      range.setDate(range.getDate() - this.day);
      return range;
    },

    set min(day) {
      this.day = day;
    }
  };

  constructor(public apiHttpService: ApiHttpService, public _formBuilder: FormBuilder) {}

  formBuilder() {
    this.apiUploadForm = this._formBuilder.group({
      programmatic: ['', [Validators.required]],
      dateFrom: [{ value: '', disabled: false }, [Validators.required]],
      dateTo: [{ value: '', disabled: false }, [Validators.required, this.validatorForDate()]]
    });
    this.SubscriptionsList.push(
      this.apiUploadForm.get('dateTo').valueChanges.subscribe((date) => {
        if (date) {
          this.unavailabilityRange.max = date;
          this.unavailabilityRange.min = 7;
        }
      })
    );
  }

  getProgrammaticsList() {
    this.SubscriptionsList.push(
      this.apiHttpService.getOriginProperties().subscribe((res) => {
        if (!res) { return; }

        return (this.programmaticsList = res.result);
      })
    );
  }

  public validatorForDate(): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const checking = new Date();

      if (checking >= group.value) { return null; } else {
        return {
          check: false
        };
      }
    };
  }
}
