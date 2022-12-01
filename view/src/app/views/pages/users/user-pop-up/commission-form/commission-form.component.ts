import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Helpers } from '../../_services-and-helpers/helpers';
import { DataTransitionService } from '../../_services-and-helpers/data-transition.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-commission-form',
  templateUrl: './commission-form.component.html',
  styleUrls: ['./commission-form.component.scss']
})
export class CommissionFormComponent extends Helpers implements OnInit, OnDestroy {
  public commissionForm: FormGroup;

  public selected;

  public showForm = false;

  public canEditCommission;

  public commissionValues: Array<string> = ['eCPM', 'Impressions'];

  subscriptions: Subscription[] = [];

  private commission;

  private permissions;

  @Input() User: any;

  constructor(private fb: FormBuilder, private transitService: DataTransitionService, private permissionsService: NgxPermissionsService) {
    super(transitService);
  }

  ngOnInit(): void {
    this.canEditCommission = this.hasRightsToEditCommission();
    this.getCommission();
  }

  getCommission() {
    this.commission = this.User.commission;
    this.selected = this.commission.commission_type;
    this.commissionForm = this.buildCommissionForm();
    this.showForm = true;
    this.subscriptions.push(
      this.commissionForm.valueChanges.subscribe((valueChangesData) => {
        this.sendFunc('commission', valueChangesData);
        this.sendEditable(true);
      })
    );
    this.subscriptions.push(
      this.commissionForm.statusChanges.subscribe((statusChangesData) => {
        statusChangesData === 'INVALID' ? this.sendEditable(true) : this.sendEditable(false);
      })
    );
  }

  buildCommissionForm() {
    return this.fb.group({
      commission_number: [
        { value: this.commission.commission_number || 0, disabled: !this.canEditCommission },
        [Validators.required, Validators.min(0), Validators.max(100)]
      ],
      commission_type: [{ value: this.commission.commission_type || 'eCPM', disabled: !this.canEditCommission }]
    });
  }

  hasRightsToEditCommission() {
    this.permissions = this.permissionsService ? this.permissionsService.getPermissions() : [];
    return !!('canEditCommission' in this.permissions || !this.User.cwe);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
