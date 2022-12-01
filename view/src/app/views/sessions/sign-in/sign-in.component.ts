import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, SignInObj } from 'shared/services/auth/auth.service';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { FormValidators } from 'shared/services/form-validators/form-validators';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from 'shared/services/layout.service';
import { egretAnimations } from 'shared/animations/egret-animations';
import { ErrorInfo, SuccessSignIn, UserInfo } from 'shared/interfaces/common.interface';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  animations: egretAnimations
})
export class SigninComponent extends FormValidators implements OnInit, OnDestroy {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;

  @ViewChild(MatButton) submitButton: MatButton;

  public isInitedContent = false;

  signInForm: FormGroup;

  private subscriptions: Subscription = new Subscription();

  error = false;

  message: string;

  showPasswordRecoveryAndSignUp = false;

  isDisable = false;

  isForgotPass = false;

  layoutConf: any;

  isRequestSent = false;

  currentLang = 'en';

  selected = this.currentLang;

  existingLangs = ['en', 'ru', 'uk', 'es'];

  availableLangs = [
    {
      name: 'English',
      code: 'en'
    },
    {
      name: 'Russian',
      code: 'ru'
    },
    {
      name: 'Spanish',
      code: 'es'
    }
  ];

  constructor(
    private sing_in: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    public translate: TranslateService,
    private layout: LayoutService
  ) {
    super();
  }

  ngOnInit() {
    this.generateForm();
    this.initSubscriptions();
    this.initSetLang();
    this.layoutConf = this.layout.layoutConf;
  }

  generateForm() {
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, this.validatorForSigningEmail()]),
      password: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      rememberMe: new FormControl(false)
    });
  }

  async initSubscriptions() {
    const changeFormSub = this.signInForm.valueChanges.subscribe((changes) => {
      this.isDisable = this.signInForm.invalid;
      // this.isForgotPass = false;
    });
    this.subscriptions.add(changeFormSub);
  }

  async initSetLang() {
    this.currentLang = this.existingLangs.includes(this.translate.getBrowserLang()) ? this.translate.getBrowserLang() : 'en';
    this.currentLang = this.currentLang === 'uk' ? 'ru' : this.currentLang;
    this.translate.use(this.currentLang);
  }

  setLang() {
    this.translate.use(this.currentLang);
  }

  signIn(form: FormGroup) {
    if (form.valid) {
      const signInObj: SignInObj = {
        email: form.value.email,
        password: form.value.password,
        keepSignedIn: form.value.rememberMe
      };
      this.isRequestSent = true;

      const authSub = this.sing_in.auth(signInObj).subscribe(
        (response: SuccessSignIn) => {
          this.submitButton.disabled = true;
          if (response.success === true) { this.successAnswer(response.user); } 
          
        },
        (err) => {
          const error: ErrorInfo = err.error;
          this.errorAnswer(error, this.currentLang);
        }
      );
      this.subscriptions.add(authSub);
    } else {
      form.markAllAsTouched();
      this.submitButton.disabled = true;
    }
  }

  forgotPassBtn(event: Event): void {
    event.stopPropagation();
    this.isForgotPass = !this.isForgotPass;
  }

  successAnswer(user: UserInfo): void {
    user.permissions.includes('prebidUserWbid') ? this.router.navigate(['wbid/analytics-charts']) : this.router.navigate(['dashboard']);
  }

  errorAnswer(error: ErrorInfo, lang: string): void {
    const errLowerC = error.msg.toLocaleLowerCase();
    this.isRequestSent = false;
    switch (lang) {
      case 'en':
        this.message = errLowerC;
        break;

      case 'es':
        if (errLowerC.includes('failed')) { this.message = 'AUTENTICACIÓN FALLIDA'; } else { this.message = 'SOLICITUD NO CORRECTA'; } 
        
        break;

      case 'ru':
        if (errLowerC.includes('failed')) { this.message = 'ОШИБКА АУТЕНТИФИКАЦИИ'; } else { this.message = 'НЕПРАВИЛЬНЫЙ ЗАПРОС'; } 
        
        break;

      default:
        this.message = errLowerC;
    }

    this.submitButton.disabled = false;
    this.flashMessage.flash('error', this.message, 3000, 'center');
  }

  ngOnDestroy(): void {
    if (this.subscriptions) { this.subscriptions.unsubscribe(); } 
    
    this.isRequestSent = false;
  }
}
