import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueForceUpdateComponent } from './revenue-force-update.component';

describe('RevenueForceUpdateComponent', () => {
  let component: RevenueForceUpdateComponent;
  let fixture: ComponentFixture<RevenueForceUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueForceUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueForceUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
