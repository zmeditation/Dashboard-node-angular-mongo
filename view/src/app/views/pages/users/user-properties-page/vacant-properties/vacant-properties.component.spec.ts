import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacantPropertiesComponent } from './vacant-properties.component';

xdescribe('VacantPropertiesComponent', () => {
  let component: VacantPropertiesComponent;
  let fixture: ComponentFixture<VacantPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VacantPropertiesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacantPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
