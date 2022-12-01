import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsFilterComponent } from './charts-filter.component';

xdescribe('ChartsFilterComponent', () => {
  let component: ChartsFilterComponent;
  let fixture: ComponentFixture<ChartsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChartsFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
