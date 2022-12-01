import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueManualInputComponent } from './revenue-manual-input.component';

describe('RevenueManualInputComponent', () => {
  let component: RevenueManualInputComponent;
  let fixture: ComponentFixture<RevenueManualInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueManualInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueManualInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
