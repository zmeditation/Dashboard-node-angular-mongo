import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoInserterComponent } from './logo-inserter.component';

xdescribe('LogoInserterComponent', () => {
  let component: LogoInserterComponent;
  let fixture: ComponentFixture<LogoInserterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LogoInserterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoInserterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
