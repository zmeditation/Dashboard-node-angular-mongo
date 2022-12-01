// import { ForgotPasswordComponent } from './forgot-password.component';
// import { PassService } from 'app/shared/services/auth/pass-change.service';
// import { FlashMessagesService } from 'app/shared/services/flash-messages.service';
// import { of, EMPTY, throwError } from 'rxjs';
//
//
// describe('Forgot-Password', () => {
//     let component: ForgotPasswordComponent;
//     let service: PassService;
//     let flashMessagS: FlashMessagesService;
//     const fakeEmail = 'email@email.email';
//
//     beforeEach(() => {
//         service = new PassService(null);
//         flashMessagS = new FlashMessagesService();
//         component = new ForgotPasswordComponent(service, flashMessagS);
//     })
//
//     describe('Check input of email.', () => {
//
//         it('Input email is exist.', () => {
//             expect(component.forgotForm.contains('email')).toBeTruthy();
//         });
//
//         it('Input email is invalid.', () => {
//             const control = component.forgotForm.get('email');
//
//             control.setValue('noEmail');
//             expect(control.valid).toBeFalsy();
//         });
//
//         it('Input email is valid.', () => {
//             const control = component.forgotForm.get('email');
//
//             control.setValue(fakeEmail);
//             expect(control.valid).toBeTruthy();
//         });
//     });
//
//     describe('Submit Email Button.', () => {
//         it('Pass parameter.', () => {
//             const spy = spyOn(service, 'changePass').and.returnValue(EMPTY);
//
//             component.submitEmail(fakeEmail);
//             expect(spy).toHaveBeenCalledWith(fakeEmail);
//         });
//     });
//
//     describe('Check PassService.', () => {
//         const dataFromServer = { success: true };
//
//         it('Should call change function.', () => {
//             const spy = spyOn(service, 'changePass').and.callFake(() => EMPTY);
//
//             component.submitEmail(component.forgotForm);
//             expect(spy).toHaveBeenCalled();
//         });
//
//         it('Should be success answer, checking message.', () => {
//             spyOn(service, 'changePass').and.returnValue(of(dataFromServer));
//
//             component.submitEmail(component.forgotForm);
//
//             expect(component.message).toContain('changed your password');
//         });
//
//         it('Should be success answer, Flash was called.', () => {
//             spyOn(service, 'changePass').and.returnValue(of(dataFromServer));
//             spyOn(flashMessagS, 'flash').and.callFake(() => EMPTY);
//
//             component.submitEmail(component.forgotForm);
//
//             expect(flashMessagS.flash).toHaveBeenCalled();
//         });
//
//         it('Should be unsuccess answer, error message.', () => {
//             const errorMsg = 'Error message.';
//             const error = { error: { msg: errorMsg }};
//
//             spyOn(service, 'changePass').and.returnValue(throwError(error));
//
//             component.submitEmail(component.forgotForm);
//
//             expect(component.message).toBe(errorMsg)
//         });
//
//     });
// });
