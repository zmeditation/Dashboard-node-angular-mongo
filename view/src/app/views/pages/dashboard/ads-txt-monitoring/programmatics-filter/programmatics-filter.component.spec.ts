import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammaticsFilterComponent } from './programmatics-filter.component';

xdescribe('ProgrammaticsFilterComponent', () => {
  let component: ProgrammaticsFilterComponent;
  let fixture: ComponentFixture<ProgrammaticsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgrammaticsFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammaticsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
