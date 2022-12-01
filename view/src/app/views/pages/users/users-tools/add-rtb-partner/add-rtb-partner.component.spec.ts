import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRtbPartnerComponent } from './add-rtb-partner.component';

describe('AddRtbPartnerComponent', () => {
  let component: AddRtbPartnerComponent;
  let fixture: ComponentFixture<AddRtbPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRtbPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRtbPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
