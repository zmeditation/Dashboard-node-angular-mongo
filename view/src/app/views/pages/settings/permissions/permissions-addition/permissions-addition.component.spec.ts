import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsAdditionComponent } from './permissions-addition.component';

xdescribe('PermissionsAdditionComponent', () => {
  let component: PermissionsAdditionComponent;
  let fixture: ComponentFixture<PermissionsAdditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionsAdditionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsAdditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
