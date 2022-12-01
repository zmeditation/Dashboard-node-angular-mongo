import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDeleteConfirmComponent } from './invoice-delete-confirm.component';

describe('InvoiceDeleteConfirmComponent', () => {
  let component: InvoiceDeleteConfirmComponent;
  let fixture: ComponentFixture<InvoiceDeleteConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceDeleteConfirmComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
