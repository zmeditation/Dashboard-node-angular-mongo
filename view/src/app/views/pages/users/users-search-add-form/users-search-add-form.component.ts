import { Subscription } from 'rxjs/Rx';
import { Subject } from 'rxjs/index';
import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, distinct, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-users-search-add-form',
  templateUrl: './users-search-add-form.component.html',
  styleUrls: ['./users-search-add-form.component.scss']
})
export class UsersSearchAddFormComponent implements OnInit, OnDestroy {
  @Output()
  public searchAll = new EventEmitter();

  @Output()
  public createUser = new EventEmitter();

  public searchValue = new FormControl('', [Validators.minLength(0), Validators.maxLength(50)]);

  public isShowSettings = false;

  protected searchType = 'name';

  public temporarySearchType = new FormControl('name');

  public searchTypes = ['name', 'email', 'domain'];

  private search$ = new Subject();

  private subscriptions: Subscription = new Subscription();

  ngOnInit() {
    this.subscriptions.add(
      this.search$.pipe(
        distinctUntilChanged(), 
        debounceTime(350)
      ).subscribe(value => {
        const type = this.searchType;

        if (!this.searchValue.errors) {
          this.searchAll.emit({ value, type });
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public searchAllByValueEvent(value: string): void {
    this.search$.next(value)
  }

  public createUserEvent(): void {
    this.createUser.emit();
  }

  public showSettings(event: { stopPropagation: Function }): void {
    event.stopPropagation();

    this.isShowSettings = !this.isShowSettings;
  }

  public denySettings(event: { stopPropagation: Function }): void {
    event.stopPropagation();

    this.isShowSettings = false;
    this.temporarySearchType.setValue(this.searchType);
  }

  public successSettings(event: { stopPropagation: Function }): void {
    event.stopPropagation();

    this.searchType = this.temporarySearchType.value;
    this.isShowSettings = false;

    if (!this.searchValue.errors) {
      const value = this.searchValue.value;
      const type = this.searchType;

      this.searchAll.emit({ value, type });
    }
  }
}
