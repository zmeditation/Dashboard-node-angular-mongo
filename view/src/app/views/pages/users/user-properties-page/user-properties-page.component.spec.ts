import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPropertiesPageComponent } from './user-properties-page.component';

xdescribe('UserPropertiesPageComponent', () => {
  let component: UserPropertiesPageComponent;
  let fixture: ComponentFixture<UserPropertiesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserPropertiesPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPropertiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
