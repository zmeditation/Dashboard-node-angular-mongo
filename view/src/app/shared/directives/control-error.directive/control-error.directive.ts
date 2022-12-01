import { Directive, Input, OnDestroy, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { merge, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { errorList } from './error-list';
import { IErrorValidationParams } from './error-validation-params.interface';
import { distinctUntilChanged, startWith } from 'rxjs/operators';

@Directive({
  selector: '[appControlError]'
})
export class ControlErrorDirective implements OnInit, OnDestroy {
  control!: AbstractControl;

  private subscription = new Subscription();

  private translateSubscription = new Subscription();

  private element: HTMLElement | undefined;

  constructor(
    private templateRef: TemplateRef<any>,
    private renderer: Renderer2,
    private viewContainer: ViewContainerRef,
    private translate: TranslateService
  ) {}

  public ngOnInit(): void {
    if (!this.control) { return; } 
    

    let errorName: string | undefined;
    const errorsApply = () => {
      const error = this.control.errors ? Object.keys(this.control.errors)[0] : undefined;
      if (error && error !== errorName) {
        errorName = error;
        this.changeErrorText(error, this.control.errors[error]);
      } else if (!error && errorName) {
        errorName = undefined;
        this.clearView();
        this.translateSubscription.unsubscribe();
      }
    };

    const merged = merge(
      this.control.valueChanges.pipe(startWith(<string | number> this.control.value)),
      this.control.statusChanges.pipe(distinctUntilChanged())
    ).subscribe(errorsApply);
    this.subscription.add(merged);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.translateSubscription.unsubscribe();
  }

  private changeErrorText(error: string, params: IErrorValidationParams | undefined): void {
    this.translateSubscription.unsubscribe();

    const errorText = errorList[error] || errorList.default;
    const text = this.translate.instant(errorText, params);

    if (!this.element) { this.element = this.viewContainer.createEmbeddedView(this.templateRef).rootNodes[0]; } 
    

    if (this.element) {
      this.renderer.setProperty(this.element, 'textContent', text);
      this.translateSubscription = this.translate.onLangChange.subscribe(() => {
        const translatedText = this.translate.instant(errorText, params);
        this.renderer.setProperty(this.element, 'textContent', translatedText);
      });
    }
  }

  private clearView(): void {
    this.viewContainer.clear();
    this.element = undefined;
  }

  @Input() set appControlError(control: AbstractControl) {
    this.control = control;
  }
}
