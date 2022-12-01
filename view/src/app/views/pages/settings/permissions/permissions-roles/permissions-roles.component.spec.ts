import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsRolesComponent } from './permissions-roles.component';

xdescribe('PermissionsRolesComponent', () => {
  let component: PermissionsRolesComponent;
  let fixture: ComponentFixture<PermissionsRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionsRolesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
