import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodesGeneratorComponent } from './codes-generator.component';

xdescribe('CodesGeneratorComponent', () => {
  let component: CodesGeneratorComponent;
  let fixture: ComponentFixture<CodesGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CodesGeneratorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodesGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
