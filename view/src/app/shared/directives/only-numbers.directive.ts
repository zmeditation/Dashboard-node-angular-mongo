import { Directive, HostListener } from '@angular/core';
import { KEYCODES } from '../helpers/keycodes';

const SPECIAL_KEYCODES = [46, 8, 9, 27, 13, 110, 190]; // enter, comma, dot end etc.

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {
  constructor() {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const ctrlPress = event.ctrlKey || event.metaKey;
    if (
      SPECIAL_KEYCODES.includes(event.keyCode) ||
      // || (event.keyCode === KEYCODES.MINUS || (event.keyCode === KEYCODES.NUM_MINUS && !event.shiftKey))
      (ctrlPress && [KEYCODES.A, KEYCODES.C, KEYCODES.V, KEYCODES.X].includes(event.keyCode)) || // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.keyCode >= KEYCODES.END && event.keyCode <= KEYCODES.DOWN)
    ) {
    // Allow: home, end, left, right
      return;
    }

    const isNumericKeyCode =
      (!event.shiftKey && event.keyCode >= KEYCODES.ZERO && event.keyCode <= KEYCODES.NINE) ||
      (event.keyCode >= KEYCODES.NUM_ZERO && event.keyCode <= KEYCODES.NUM_NINE);
    if (!isNumericKeyCode) {
      event.preventDefault();
    }

  }
}
