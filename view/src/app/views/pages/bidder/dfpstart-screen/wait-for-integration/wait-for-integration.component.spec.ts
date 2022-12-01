import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitForIntegrationComponent } from './wait-for-integration.component';

xdescribe('WaitForIntegrationComponent', () => {
  let component: WaitForIntegrationComponent;
  let fixture: ComponentFixture<WaitForIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitForIntegrationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitForIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
