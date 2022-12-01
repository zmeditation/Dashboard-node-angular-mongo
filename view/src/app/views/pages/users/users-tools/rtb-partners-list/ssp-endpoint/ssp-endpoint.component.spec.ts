import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SspEndpointComponent } from './ssp-endpoint.component';

describe('SspEndpointComponent', () => {
  let component: SspEndpointComponent;
  let fixture: ComponentFixture<SspEndpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SspEndpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SspEndpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
