import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersBiddersListComponent } from './filters-bidders-list.component';

xdescribe('FiltersBiddersListComponent', () => {
  let component: FiltersBiddersListComponent;
  let fixture: ComponentFixture<FiltersBiddersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersBiddersListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersBiddersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
