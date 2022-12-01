import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { OrtbEndpointsService } from "shared/services/cruds/ortb-endpoints.service";
import { Subscription } from "rxjs";
import { FlashMessagesService } from "shared/services/flash-messages.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-add-rtb-partner',
  templateUrl: './add-rtb-partner.component.html',
  styleUrls: ['./add-rtb-partner.component.scss']
})
export class AddRtbPartnerComponent implements OnInit {

  form: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    secret_key: new FormControl(''),
    endpoint: new FormControl('')
  })

  private subscriptions: Subscription = new Subscription()

  constructor(
    public OrtbEndpoints: OrtbEndpointsService,
    private flashMessage: FlashMessagesService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
  }

  sendRequest() {
    if (!this.form.valid) {
      return;
    }
    const query = this.form.value;
    const addPartnerSub = this.OrtbEndpoints.addRTBPartner(query).subscribe(
      data => {
        if (data.success === false) {
          return this.flashMessage.flash('error',
            (this.translate.instant('TOOLS.RTB.USER_NOT_ADDED')
              + this.translate.instant('TOOLS.RTB.ERRORS.' + data.result) || this.translate.instant('TOOLS.RTB.ERRORS.OTHER')),
            3000, 'center');
        }
        this.form.reset();
        this.form.get('type').setErrors(null);
        this.form.get('name').setErrors(null);
        this.form.updateValueAndValidity();
        return this.flashMessage.flash('success', this.translate.instant('TOOLS.RTB.USER_ADDED'), 3000, 'center');

      }, error => {
        console.error(error);
        return this.flashMessage.flash('error',
          this.translate.instant('TOOLS.RTB.USER_NOT_ADDED', { reason: error.error?.msg || error.message }),
          3000, 'center');
      })

    this.subscriptions.add(addPartnerSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
