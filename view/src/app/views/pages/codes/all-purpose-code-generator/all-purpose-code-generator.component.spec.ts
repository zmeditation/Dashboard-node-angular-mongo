import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPurposeCodeGeneratorComponent } from './all-purpose-code-generator.component';

describe('AllPurposeCodeGeneratorComponent', () => {
  let component: AllPurposeCodeGeneratorComponent;
  let fixture: ComponentFixture<AllPurposeCodeGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllPurposeCodeGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPurposeCodeGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
