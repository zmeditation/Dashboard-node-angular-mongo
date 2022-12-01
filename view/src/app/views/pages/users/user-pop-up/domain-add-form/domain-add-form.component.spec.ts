import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainAddFormComponent } from './domain-add-form.component';

xdescribe('DomainAddFormComponent', () => {
  let component: DomainAddFormComponent;
  let fixture: ComponentFixture<DomainAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DomainAddFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
