import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCreateRevenueHelperComponent } from './update-create-revenue-helper.component';

describe('UpdateCreateRevenueHelperComponent', () => {
  let component: UpdateCreateRevenueHelperComponent;
  let fixture: ComponentFixture<UpdateCreateRevenueHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCreateRevenueHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCreateRevenueHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
