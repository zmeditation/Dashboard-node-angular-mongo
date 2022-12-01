import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFilterComponent } from './main-filter.component';

xdescribe('MainFilterComponent', () => {
  let component: MainFilterComponent;
  let fixture: ComponentFixture<MainFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
