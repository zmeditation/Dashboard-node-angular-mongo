import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DomainListComponent } from './domain-list.component';

xdescribe('DomainListComponent', () => {
  let component: DomainListComponent;
  let fixture: ComponentFixture<DomainListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DomainListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
