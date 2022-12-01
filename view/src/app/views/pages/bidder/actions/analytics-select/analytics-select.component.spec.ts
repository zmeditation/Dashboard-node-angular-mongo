import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsSelectComponent } from './analytics-select.component';

xdescribe('AnalyticsSelectComponent', () => {
  let component: AnalyticsSelectComponent;
  let fixture: ComponentFixture<AnalyticsSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsSelectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
