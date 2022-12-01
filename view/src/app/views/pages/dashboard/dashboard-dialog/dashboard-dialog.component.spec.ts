import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDialogComponent } from './dashboard-dialog.component';

describe('DashboardDialogComponent', () => {
  let component: DashboardDialogComponent;
  let fixture: ComponentFixture<DashboardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
