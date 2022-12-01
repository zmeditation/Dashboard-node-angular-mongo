import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersAmListComponent } from './filters-am-list.component';

xdescribe('FiltersAmListComponent', () => {
  let component: FiltersAmListComponent;
  let fixture: ComponentFixture<FiltersAmListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersAmListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersAmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
