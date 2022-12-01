import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueDeleteComponent } from './revenue-delete.component';

describe('RevenueDeleteComponent', () => {
  let component: RevenueDeleteComponent;
  let fixture: ComponentFixture<RevenueDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
