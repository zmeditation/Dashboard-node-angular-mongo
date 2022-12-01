import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenuePopupComponent } from './revenue-popup.component';

describe('RevenuePopupComponent', () => {
  let component: RevenuePopupComponent;
  let fixture: ComponentFixture<RevenuePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenuePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenuePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
