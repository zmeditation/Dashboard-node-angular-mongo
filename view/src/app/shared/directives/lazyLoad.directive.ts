import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements OnInit {
  private div = this.renderer.createElement('div');

  private img = this.renderer.createElement('img');

  private state = document.readyState;

  constructor(private renderer: Renderer2, private hostElement: ElementRef) {
    renderer.setStyle(hostElement.nativeElement, 'position', 'relative');
  }

  ngOnInit() {
    if (this.state === 'loading' || this.state === 'interactive') {
      this.setLoadImg();
      this.checkPageLoading();
    }
  }

  private setLoadImg(): void {
    this.renderer.addClass(this.div, 'lazy-container');
    this.renderer.addClass(this.img, 'lazy-img-rotate');

    this.renderer.setAttribute(this.img, 'src', 'assets/images/lazy-loading.svg');
    this.renderer.appendChild(this.div, this.img);
    this.renderer.appendChild(this.hostElement.nativeElement, this.div);
  }

  private changeClassLoadImg(): Promise<void> {
    return new Promise((resolve) => {
      this.renderer.addClass(this.div, 'lazy-container-none');
      resolve();
    });
  }

  private checkPageLoading(): void {
    window.onload = () => {
      this.changeClassLoadImg().then((_) => {
        // If you now better way, change it !
        setTimeout(() => {
          this.renderer.removeClass(this.div, 'lazy-container');
          this.renderer.removeClass(this.div, 'lazy-container-none');
          this.renderer.addClass(this.div, 'display-none');
        }, 3000);
      });
    };
  }
}
