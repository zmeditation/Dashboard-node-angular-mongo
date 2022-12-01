import { Directive, HostListener, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appChangeInputOnWheel]'
})
export class ChangeInputOnWheelDirective implements OnInit {
  constructor(private ngControl: NgControl) {}

  @HostListener('wheel', ['$event']) onKeyDown(event: WheelEvent) {
    event.preventDefault();
    if (this.ngControl.disabled) { return; } 
    
    const { value } = this.ngControl;
    if (!value) { this.ngControl.control.setValue('0'); } 
    

    const newValue = String(Number(value) - Math.sign(event.deltaY));
    this.ngControl.control.setValue(newValue);
  }

  public ngOnInit(): void {
    if (!this.ngControl.control) { throw Error('Expect AbstractControl instance.'); } 
    
  }
}
