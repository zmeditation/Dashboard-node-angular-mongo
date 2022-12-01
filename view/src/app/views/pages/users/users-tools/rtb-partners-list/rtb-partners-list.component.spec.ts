import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtbPartnersListComponent } from './rtb-partners-list.component';

describe('RtbPartnersListComponent', () => {
  let component: RtbPartnersListComponent;
  let fixture: ComponentFixture<RtbPartnersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtbPartnersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtbPartnersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
