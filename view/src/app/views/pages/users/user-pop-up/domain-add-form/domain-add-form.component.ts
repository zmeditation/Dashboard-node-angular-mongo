import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrudService } from 'shared/services/cruds/crud.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DataTransitionService } from '../../_services-and-helpers/data-transition.service';
import { Helpers } from '../../_services-and-helpers/helpers';
import { Observable, Subscription } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
export interface Domain {
  name: string;
}
@Component({
  selector: 'app-domain-add-form',
  templateUrl: './domain-add-form.component.html',
  styleUrls: ['./domain-add-form.component.scss']
})
export class DomainAddFormComponent extends Helpers implements OnInit, OnDestroy {
  public commissionForm: FormGroup;

  public domainList: Array<string>;

  public includeDomains: Array<string> = [];

  public excludeDomains: Array<string> = [];

  public selectable = true;

  public removable = true;

  public addOnBlur = true;

  public showDomainEditForm = true;

  public ErrorHandler = false;

  public reason = ' ';

  public showEditButton = false;

  public selected;

  public showForm = false;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild(MatAutocompleteTrigger)
  autoTrigger: MatAutocompleteTrigger;

  private tempDomainList;

  private User: Observable<any>;

  private permissions;

  public isRequestSent = false;

  public canSaveDomains = false;

  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private crudService: CrudService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transitService: DataTransitionService,
    private permissionsService: NgxPermissionsService
  ) {
    super(transitService);
  }

  ngOnInit() {
    this.permissions = this.permissionsService.getPermissions();

    this.User = this.crudService.getUser(this.data.payload._id);

    this.getDomains();
  }

  editDomains() {
    this.tempDomainList = this.domainList;
    this.showDomainEditForm = !this.showDomainEditForm;
    this.showEditButton = true;
  }

  saveDomains() {
    // this.sendEditable(true);
    this.isRequestSent = true;
    const result = {
      user: this.data.payload._id,
      exclude: Array.from(new Set(this.excludeDomains)),
      include: Array.from(new Set(this.includeDomains))
    };

    // this.sendFunc('domains', result);
    this.crudService.updateDomain(result).subscribe(
      (resp: any) => {
        if (resp.success) {
          this.getDomains();
          this.showEditButton = false;
          this.showDomainEditForm = !this.showDomainEditForm;
          this.invalid = true;
          this.isRequestSent = false;
          // this.sendEditable(false);
          this.excludeDomains = [];
          this.includeDomains = [];
          this.canSaveDomains = false;
        }
      },
      (error) => {
        console.error('error', error);
        this.isRequestSent = false;
      }
    );
  }

  resetDomains() {
    this.getDomains();
    this.showEditButton = false;
    this.canSaveDomains = false;
    this.showDomainEditForm = !this.showDomainEditForm;
    this.includeDomains = [];
    this.excludeDomains = [];
    this.ErrorHandler = false;
    this.isRequestSent = false;
  }

  getDomains() {
    this.subscriptions.push(
      this.crudService.getUserDomains(this.data.payload._id).subscribe((data: Array<string>) => {
        this.domainList = data;
      })
    );
  }

  addDomain(event: MatChipInputEvent): void {
    // this.sendEditable(true);
    const input = event.input;
    const value = event.value;
    const boolExistDomain = this.domainList.some((domain) => {
      return domain === value;
    });
    const regex = new RegExp(`^(https?:\\/\\/)?([\\da-z|а-я|À-ÿ\\.-]+)\\.([a-z|а-я|À-ÿ\\.]{2,6})([\\/\\w \\.-]*)*\\/?$`);
    const boolDomainPattern = regex.test(value);
    if (boolDomainPattern === true && boolExistDomain === false) {
      if ((value || '').trim()) {
        this.ErrorHandler = false;
        if (this.excludeDomains.includes(value.trim())) { this.excludeDomains.splice(this.excludeDomains.indexOf(value.trim()), 1); }

        this.includeDomains.push(value.trim());
        this.domainList.push(value.trim());
      }
      if (input) { input.value = ''; }

      if (this.includeDomains.length || this.excludeDomains.length) { this.canSaveDomains = true; }

    } else {
      if (boolExistDomain === true && value !== '') {
        this.ErrorHandler = true;
        this.reason = 'that domain is already in list';
      } else if (boolDomainPattern === false && value !== '') {
        this.ErrorHandler = true;
        this.reason = 'wrong pattern for domain';
      }
    }
  }

  removeDomain(domain): void {
    // this.sendEditable(true);
    const indexView = this.domainList.indexOf(domain);
    const indexIncludeArray = this.includeDomains.indexOf(domain);
    if (indexIncludeArray !== -1) { this.includeDomains.splice(indexIncludeArray, 1); }

    this.excludeDomains.push(domain);
    if (indexView >= 0) { this.domainList.splice(indexView, 1); }

    if (this.includeDomains.length || this.excludeDomains.length) { this.canSaveDomains = true; }

  }

  removeAllDomains() {
    // this.sendEditable(true);
    this.domainList.forEach((d) => {
      this.excludeDomains.push(d);
    });
    this.domainList.splice(0, this.domainList.length);
    if (this.includeDomains.length || this.excludeDomains.length) { this.canSaveDomains = true; }

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
