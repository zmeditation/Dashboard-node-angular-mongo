import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VastGeneratorComponent } from './vast-generator.component';

xdescribe('VastGeneratorComponent', () => {
  let component: VastGeneratorComponent;
  let fixture: ComponentFixture<VastGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VastGeneratorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VastGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
