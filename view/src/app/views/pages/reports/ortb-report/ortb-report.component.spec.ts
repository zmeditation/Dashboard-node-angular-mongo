import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrtbReportComponent } from './ortb-report.component';

describe('OrtbReportComponent', () => {
  let component: OrtbReportComponent;
  let fixture: ComponentFixture<OrtbReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrtbReportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrtbReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
