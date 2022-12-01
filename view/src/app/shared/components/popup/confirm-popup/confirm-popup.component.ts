import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent {
  @Input()
  public title = '';

  @Input()
  public message = '';

  @Output()
  public approve = new EventEmitter();

  @Output()
  public deny = new EventEmitter();

  public approveEvent() {
    this.approve.emit();
  }

  public denyEvent() {
    this.deny.emit();
  }
}
