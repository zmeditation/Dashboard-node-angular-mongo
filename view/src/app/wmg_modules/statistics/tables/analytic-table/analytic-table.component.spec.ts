import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticTableComponent } from './analytic-table.component';

xdescribe('AnalyticTableComponent', () => {
  let component: AnalyticTableComponent;
  let fixture: ComponentFixture<AnalyticTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
