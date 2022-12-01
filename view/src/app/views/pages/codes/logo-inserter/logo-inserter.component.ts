import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { egretAnimations } from "shared/animations/egret-animations";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-logo-inserter',
  templateUrl: './logo-inserter.component.html',
  styleUrls: ['./logo-inserter.component.scss'],
  animations: egretAnimations
})
export class LogoInserterComponent implements OnInit {
  @ViewChild('adb', { read: ElementRef }) adb: ElementRef;

  code: string;

  result: string;

  width: string;

  height: string;

  value: string;

  sample = `<!-- Passback Light AdSlot 1 for Ad Unit 'setquest_300*600' ### Size: [[300,600]] -->
  <div data-glade id='glade-aslot-1'
        data-ad-unit-path='/112081842/setquest_300*600'
        width='300' height='600'
        data-click-url='%%CLICK_URL_UNESC%%'
        data-page-url='https://setquest.com'></div>
  <script async src='https://securepubads.g.doubleclick.net/static/glade.js'></script>
<!-- End -->`;

  disableCodeInput = false;

  enableSpinner = false;

  showTransformBtn = true;

  // preview
  showPreviewBtn = false;

  showPreviewContainer = false;

  showDestroyPreviewBtn = false;

  isLinear = true;

  // Forms for each step

  firstFormGroup: FormGroup;

  secondFormGroup: FormGroup;

  thirdFormGroup: FormGroup;

  // Array of objects with styles for logotype location

  logotypeLocations = [
    // {
    //   value: 0,
    //   viewValue: 'Top Right',
    //   styles: 'top: 4px; right: -40px; flex-direction: row;',
    //   stylesHover: 'transform: translateX(-45px)',
    // },
    {
      value: 1,
      viewValue: 'top_left',
      styles: 'top: 4px; left: 0px; flex-direction: row-reverse;',
      stylesHover: 'transform: translateX(37px)'
    },
    {
      value: 2,
      viewValue: 'bottom_right',
      styles: 'bottom: 0px; right: 0px; flex-direction: row;',
      stylesHover: 'transform: translateX(-37px)'
    },
    {
      value: 3,
      viewValue: 'bottom_left',
      styles: 'bottom: 0px; left: 0px; flex-direction: row-reverse;',
      stylesHover: 'transform: translateX(37px)'
    }
  ];

  constructor(public snackBar: MatSnackBar, private _formBuilder: FormBuilder) {}

  ngOnInit() {
    // Build forms
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: [{ value: '' }, Validators.required],
      subSecondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
  }

  // Button from step-1 to step-2

  transform_1(stepper) {
    this.showPreviewContainer = false;
    this.showDestroyPreviewBtn = false;
    this.code = this.firstFormGroup.get('firstCtrl').value;

    if (this.code && this.code.length > 0) {
      this.secondFormGroup.get('secondCtrl').setValue(this.code);
      this.showPreviewBtn = true;

      stepper.next();
    } else {
      this.showPreviewBtn = false;
      this.openSnackBar('No code was provided!', '');
    }
  }

  // Button from step-2 to step-3

  transform_2(stepper) {
    this.showPreviewContainer = false;
    this.showDestroyPreviewBtn = false;
    if (this.secondFormGroup.get('subSecondCtrl').value !== '') {
      this.addLogoScript(this.firstFormGroup.get('firstCtrl').value);
      this.showTransformBtn = false;
      this.showPreviewBtn = true;
      stepper.next();
    } else if (this.secondFormGroup.get('subSecondCtrl').value === '') {
      this.showPreviewBtn = false;
      this.openSnackBar('Choose logotype location!', '');
      return;
    }
  }

  chooseLocation() {
    const sampleBlockAd = `<div style="display: flex; flex-flow: column wrap; position: relative; width: 300px; height: 300px;"><div style="background-color: rgb(250, 250, 250); flex: 1"></div></div>`,
      id = this.randomNumber(),
      locStyles = this.secondFormGroup.get('subSecondCtrl').value.styles,
      div1 = `<div style="position: relative; display: inline-block; overflow: hidden;">`,
      logoAnchor = `<style> #wmg-logo-${ id } {transition: all .5s ease-out;}</style><a id="wmg-logo-${ id }" title="Programmatic Agency WMG" style="z-index: 2; position: absolute; ${ locStyles } line-height: 50%; display: flex; align-items: center; height: 14px; font-size: 11px; transition: all 0.7s ease 0s; color: black; text-decoration: none;" href="http://adwmg.com/" target="_blank"><svg alt="wmg-logo" width="12" height="12" style="margin: 0px 5px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 239.2 201.54"><defs><style>.cls-1{fill:url(#linear-gradient);}.cls-2{fill:url(#linear-gradient-2);}.cls-3{fill:url(#linear-gradient-3);}</style><linearGradient id="linear-gradient" x1="190.89" y1="11.25" x2="223.15" y2="49.38" gradientTransform="translate(238.06 -176.72) rotate(89.69)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#008da5"/><stop offset="1" stop-color="#02916b"/></linearGradient><linearGradient id="linear-gradient-2" x1="30.57" y1="103.15" x2="117.46" y2="100.42" gradientTransform="translate(63.41 -22.63) rotate(31.31)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#18815b"/><stop offset="1" stop-color="#0d325f"/></linearGradient><linearGradient id="linear-gradient-3" x1="116.95" y1="103.15" x2="203.85" y2="100.42" gradientTransform="translate(75.99 -67.51) rotate(31.31)" xlink:href="#linear-gradient"/></defs><title>WMG International</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><circle class="cls-1" cx="207.87" cy="31.32" r="31.32" transform="translate(175.41 239.02) rotate(-89.69)"/><rect class="cls-2" x="42.85" y="-9.86" width="58.47" height="223.4" rx="29.23" ry="29.23" transform="translate(-42.42 52.28) rotate(-31.31)"/><rect class="cls-3" x="129.24" y="-9.86" width="58.47" height="223.4" rx="29.23" ry="29.23" transform="translate(-29.85 97.17) rotate(-31.31)"/></g></g></svg></a>`,
      div2 = `</div>`;

    this.result = `${ div1 }\n${ sampleBlockAd }\n${ logoAnchor }\n${ div2 }`;
    this.showPreviewContainer = true;
  }

  resetChoseLocation() {
    this.showPreviewContainer = false;
    this.result = '';
  }

  addLogoScript(code) {
    const id = this.randomNumber();
    const locStyles = this.secondFormGroup.get('subSecondCtrl').value.styles;

    const div1 = `<div style="position: relative; display: inline-block; overflow: hidden;">`;
    const logoAnchor = `<style> #wmg-logo-${ id } {transition: all .5s ease-out;}</style><a id="wmg-logo-${ id }" title="Programmatic Agency WMG" style="z-index: 2; position: absolute; ${ locStyles } line-height: 50%; display: flex; align-items: center; height: 14px; font-size: 11px; transition: all 0.7s ease 0s; color: black; text-decoration: none;" href="http://adwmg.com/" target="_blank" id="wmg-logo-${ id }"><svg alt="wmg-logo" width="12" height="12" style="margin: 0px 5px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 239.2 201.54"><defs><style>.cls-1{fill:url(#linear-gradient);}.cls-2{fill:url(#linear-gradient-2);}.cls-3{fill:url(#linear-gradient-3);}</style><linearGradient id="linear-gradient" x1="190.89" y1="11.25" x2="223.15" y2="49.38" gradientTransform="translate(238.06 -176.72) rotate(89.69)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#008da5"/><stop offset="1" stop-color="#02916b"/></linearGradient><linearGradient id="linear-gradient-2" x1="30.57" y1="103.15" x2="117.46" y2="100.42" gradientTransform="translate(63.41 -22.63) rotate(31.31)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#18815b"/><stop offset="1" stop-color="#0d325f"/></linearGradient><linearGradient id="linear-gradient-3" x1="116.95" y1="103.15" x2="203.85" y2="100.42" gradientTransform="translate(75.99 -67.51) rotate(31.31)" xlink:href="#linear-gradient"/></defs><title>WMG International</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><circle class="cls-1" cx="207.87" cy="31.32" r="31.32" transform="translate(175.41 239.02) rotate(-89.69)"/><rect class="cls-2" x="42.85" y="-9.86" width="58.47" height="223.4" rx="29.23" ry="29.23" transform="translate(-42.42 52.28) rotate(-31.31)"/><rect class="cls-3" x="129.24" y="-9.86" width="58.47" height="223.4" rx="29.23" ry="29.23" transform="translate(-29.85 97.17) rotate(-31.31)"/></g></g></svg></a>`;
    const div2 = `</div>`;

    if (this.value === 'Criteo' || 'Google Ad Exchange' || 'Google dfp Passback') {
      this.result = `${ div1 }\n${ code }\n${ logoAnchor }\n${ div2 }`;
    }


    this.result = `${ div1 }\n${ code }\n${ logoAnchor }\n${ div2 }`;
    this.thirdFormGroup.get('thirdCtrl').setValue(this.result);
  }

  randomNumber() {
    return Math.floor(Math.random() * 600000000);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }

  showPreview() {
    this.showPreviewContainer = true;
    this.showPreviewBtn = false;
    this.showDestroyPreviewBtn = true;
  }

  destroyPreview() {
    this.showPreviewContainer = false;
    this.showPreviewBtn = true;
    this.showDestroyPreviewBtn = false;
  }

  resetForNewCode(stepper) {
    if (this.showPreviewContainer) { this.destroyPreview(); }

    this.secondFormGroup.get('subSecondCtrl').setValue('');
    this.firstFormGroup.get('firstCtrl').setValue('');
    this.thirdFormGroup.get('thirdCtrl').setValue('');
    this.showTransformBtn = true;
    stepper.reset();
  }
}
