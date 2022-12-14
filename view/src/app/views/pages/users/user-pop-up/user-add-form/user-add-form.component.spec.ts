import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddFormComponent } from './user-add-form.component';

xdescribe('UserAddFormComponent', () => {
  let component: UserAddFormComponent;
  let fixture: ComponentFixture<UserAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserAddFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
