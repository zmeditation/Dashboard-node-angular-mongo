import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPlacementComponent } from './add-placement.component';

xdescribe('AddPlacementComponent', () => {
  let component: AddPlacementComponent;
  let fixture: ComponentFixture<AddPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPlacementComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
