import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WbidChartsComponent } from './wbid-charts.component';

xdescribe('WbidChartsComponent', () => {
  let component: WbidChartsComponent;
  let fixture: ComponentFixture<WbidChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WbidChartsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WbidChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
