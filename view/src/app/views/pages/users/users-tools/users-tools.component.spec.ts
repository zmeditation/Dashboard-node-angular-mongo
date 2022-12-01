import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersToolsComponent } from './users-tools.component';

xdescribe('UsersToolsComponent', () => {
  let component: UsersToolsComponent;
  let fixture: ComponentFixture<UsersToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersToolsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
