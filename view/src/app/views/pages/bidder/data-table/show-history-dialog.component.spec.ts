import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowHistoryDialogComponent } from './show-history-dialog.component';

xdescribe('ShowHistoryDialogComponent', () => {
  let component: ShowHistoryDialogComponent;
  let fixture: ComponentFixture<ShowHistoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowHistoryDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
