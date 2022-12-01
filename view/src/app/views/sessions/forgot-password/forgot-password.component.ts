import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { FormValidators } from 'shared/services/form-validators/form-validators';
import { PassService } from 'shared/services/auth/pass-change.service';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { ErrorInfo } from 'shared/interfaces/common.interface';

export interface SuccessPassChanged {
  success: boolean;
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends FormValidators implements OnInit {
  message = 'You are changed your password, if you have`t message please check spam';

  @Input() currentLang: string;

  @Output() popUpChange = new EventEmitter();

  forgotForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private change_pass: PassService, private flashMessage: FlashMessagesService) {
    super();
  }

  ngOnInit() {}

  submitEmail(email: string) {
    this.change_pass.changePass(email).subscribe(
      (status: SuccessPassChanged) => {
        if (status.success === true) { this.successAnswer(this.currentLang); }

      },
      (err) => {
        const error: ErrorInfo = err.error;
        this.errorAnswer(error, this.currentLang);
      }
    );
  }

  successAnswer(lang: string): void {
    switch (lang) {
      case 'en':
        this.message = 'You successfully changed your password, if you haven`t received verification email, please check your Spam folder';
        break;
      case 'es':
        this.message = 'Ha cambiado su contraseña, si no ha recibido el correo electrónico de verificación, busque en la carpeta Spam';
        break;
      case 'ru':
        this.message = 'Вы сменили пароль, если у вас нет сообщения, проверьте спам';
        break;
      default:
        break;
    }

    this.flashMessage.flash('success', this.message, 7000, 'center');
    this.popUpChange.emit();
  }

  errorAnswer(error: ErrorInfo, lang: string): void {
    const errLowerC = error.msg.toLocaleLowerCase();

    switch (lang) {
      case 'en':
        this.message = errLowerC;
        break;

      case 'es':
        if (errLowerC.includes('not found')) {
          this.message = 'NO SE HA ENCONTRADO LA DIRECCIÓN';
        } else if (errLowerC.includes('service is fail')) {
          this.message = 'EL SERVICIO DEL CORREO NO ESTÁ FUNCIONANDO, POR FAVOR INTENTE OTRA VEZ';
        } else {
          this.message = 'ERROR DEL SERVIDOR';
        }

        break;

      case 'ru':
        if (errLowerC.includes('not found')) {
          this.message = 'ЭЛЕКТРОННЫЙ АДРЕС НЕ НАЙДЕН';
        } else if (errLowerC.includes('service is fail')) {
          this.message = 'СЛУЖБА ЭЛЕКТРОННОЙ ПОЧТЫ НЕ РАБОТАЕТ, ПОЖАЛУЙСТА, ПОПРОБУЙТЕ ЕЩЕ РАЗ';
        } else {
          this.message = 'ОШИБКА СЕРВЕРА';
        }

        break;

      default:
        this.message = error.msg;
    }

    this.flashMessage.flash('error', this.message, 3000, 'top');
  }
}
