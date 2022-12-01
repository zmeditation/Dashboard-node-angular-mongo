import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrudService } from 'shared/services/cruds/crud.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {
  public contactsForm: FormGroup;

  private Subscriptions: Subscription[] = [];

  public only_publishers = true;

  public response;

  constructor(public fb: FormBuilder, public crudService: CrudService) {}

  ngOnInit(): void {
    this.generateForm();
  }

  generateForm() {
    this.contactsForm = this.fb.group({
      include: [''],
      exclude: [''],
      only_publishers: [this.only_publishers]
    });
  }

  sendRequest(data) {
    this.Subscriptions.push(
      this.crudService.getEmailsList().subscribe((response) => {
        this.response = response;
      })
    );
  }

  ngOnDestroy(): void {
    this.Subscriptions.forEach((sub) => sub.unsubscribe);
  }
}
