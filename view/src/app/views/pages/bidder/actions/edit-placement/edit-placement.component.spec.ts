import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlacementComponent } from './edit-placement.component';

xdescribe('EditConfigComponent', () => {
  let component: EditPlacementComponent;
  let fixture: ComponentFixture<EditPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditPlacementComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
