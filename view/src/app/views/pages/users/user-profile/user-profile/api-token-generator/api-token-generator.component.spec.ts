import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTokenGeneratorComponent } from './api-token-generator.component';

xdescribe('ApiTokenGeneratorComponent', () => {
  let component: ApiTokenGeneratorComponent;
  let fixture: ComponentFixture<ApiTokenGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApiTokenGeneratorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTokenGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
