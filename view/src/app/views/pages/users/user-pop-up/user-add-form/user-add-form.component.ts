import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Helpers } from '../../_services-and-helpers/helpers';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudService } from 'shared/services/cruds/crud.service';
import { DataTransitionService } from '../../_services-and-helpers/data-transition.service';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-add-form',
  templateUrl: './user-add-form.component.html',
  styleUrls: ['./user-add-form.component.scss']
})
export class UserAddFormComponent extends Helpers implements OnInit, OnDestroy {
  public selectable = true;

  public removable = true;

  public addOnBlur = true;

  public separatorKeysCodes: number[] = [ENTER, COMMA];

  public userForm = new FormControl();

  public title = '';

  private Subscriptions: Subscription[] = [];

  public filteredUsers: Observable<string[]>;

  @ViewChild('UserInput') UserInput: ElementRef<HTMLInputElement>;

  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @Input() userType: string;

  public showEditButton;

  public showUserEditForm = true;

  public userList: Array<any>;

  public freeUsers: Array<any>;

  public loadUsers = false;

  private userListToSend: Array<any>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private crudService: CrudService, private transitService: DataTransitionService) {
    super(transitService);
    this.updateFilteredUsers();
  }

  ngOnInit() {
    this.sendEditable(false);
    this.initUsers(this.userType);
  }

  initUsers(usertype?) {
    this.getUser(this.data.payload._id);
    this.getFreeUsers(usertype);
    this.title = usertype === 'publisher' ? 'Publishers' : 'Account Managers';
  }

  getFreeUsers(usertype) {
    this.Subscriptions.push(
      this.crudService.getFreeUsers(usertype).subscribe((data: any) => {
        if (data.users.length === 0) { return; }

        this.freeUsers = data.users;
      })
    );
  }

  updateFilteredUsers() {
    this.filteredUsers = this.userForm.valueChanges.pipe(
      startWith(<string>null),
      map((pub: any | null) => (pub ? this._filter(pub.name || pub) : this.freeUsers.slice()))
    );
  }

  // add(event: MatChipInputEvent): void {
  //   if (!this.matAutocomplete.isOpen) {
  //     const input = event.input;
  //     const value = event.value;
  //     // Add our fruit
  //     if ((value || '').trim()) {
  //       this.userList.push(value.trim());
  //     }
  //     // Reset the input value
  //     if (input) {
  //       input.value = '';
  //     }
  //     this.userForm.setValue(null);
  //   }
  //   this.freeUsers = this.freeUsers.filter(us => {
  //     return us['_id'] !== event.value;
  //   });
  //   this.updateFilteredUsers();
  // }

  remove(publ): void {
    const index = this.userList.indexOf(publ);
    if (index >= 0) { this.userList.splice(index, 1); }

    this.freeUsers.push(publ);
    this.updateFilteredUsers();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const user = {
      _id: event.option.value,
      name: event.option.viewValue
    };
    this.userList.push(user);
    this.freeUsers = this.freeUsers.filter((us) => {
      return us._id !== event.option.value;
    });
    this.UserInput.nativeElement.value = '';
    this.userForm.setValue(null);
    this.updateFilteredUsers();
  }

  editPublishers() {
    this.sendEditable(true);
    this.getFreeUsers(this.userType);
    this.showUserEditForm = !this.showUserEditForm;
    this.showEditButton = true;
  }

  saveUser() {
    this.showEditButton = false;
    this.showUserEditForm = !this.showUserEditForm;
    this.sendEditable(false);
    this.sendUserlist(this.userType);
  }

  resetUser() {
    this.sendEditable(false);
    this.showEditButton = false;
    this.showUserEditForm = !this.showUserEditForm;
    this.getUser(this.data.payload._id);
  }

  sendUserlist(usertype) {
    this.userListToSend = this.userList.map((user) => user._id);
    usertype === 'publisher' ? this.sendFunc('publishers', this.userListToSend) : this.sendFunc('managers', this.userListToSend);
  }

  private getUser(id) {
    this.loadUsers = true;
    this.crudService.getUser(id).subscribe((data) => {
      this.userList = this.userType === 'publisher' ? data.user.connected_users.p : data.user.connected_users.am;
      this.loadUsers = false;
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.freeUsers.filter((pub) => pub.name.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy(): void {
    this.Subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
