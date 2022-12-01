import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryMessageErrorComponent } from './temporary-message-error.component';

xdescribe('TemporaryMessageErrorComponent', () => {
  let component: TemporaryMessageErrorComponent;
  let fixture: ComponentFixture<TemporaryMessageErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TemporaryMessageErrorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryMessageErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
