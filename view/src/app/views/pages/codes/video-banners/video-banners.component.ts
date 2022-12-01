import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Snippets } from './snippets/-snippets';
import { egretAnimations } from "shared/animations/egret-animations";

@Component({
  selector: 'app-video-banners',
  templateUrl: './video-banners.component.html',
  styleUrls: ['./video-banners.component.scss'],
  animations: egretAnimations
})
export class VideoBannersComponent extends Snippets implements OnInit {
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

  disableCodeInput = true;

  showChannelInput = false;

  showWidthHeightPanel = false;

  enableSpinner = false;

  showTransformBtn = true;

  // preview
  showPreviewBtn = false;

  showPreviewContainer = false;

  showDestroyPreviewBtn = false;

  constructor(public snackBar: MatSnackBar) {
    super();
  }

  ngOnInit() {}

  transform(stepper) {
    this.showPreviewContainer = false;
    this.showDestroyPreviewBtn = false;

    // console.log(this.value, this.code);

    if (this.value === undefined) {
      this.openSnackBar('No code was provided!', '');
      return;
    }

    if (this.code && this.code.length > 0) {
      if (this.value === 'googlePassback') {
        this.showTransformBtn = false;
        this.enableSpinner = true;

        setTimeout(() => {
          this.showTransformBtn = true;
          this.enableSpinner = false;
          this.result = this.transformGooglePassback(
            this.code,
            this.googlePassbackObjectKeys,
            this.googlePassBackValues,
            this.googlePassbackObject,
            this.spotxChannelId
          );

          this.result.includes('Error') ? (this.showPreviewBtn = false) : (this.showPreviewBtn = true);

          stepper.next();
        }, 900);
      } else if (this.value === 'criteo') {
        if (this.width === undefined || this.width === '' || this.height === undefined || this.height === '') {
          this.openSnackBar('Please, Enter a Width and Height Value!', '');
          return;
        }

        this.result = this.transformCriteo(
          this.code,
          this.criteObjectKeys,
          this.criteoValues,
          this.criteoObject,
          this.spotxChannelId,
          this.width,
          this.height
        );

        this.result.includes('Error') ? (this.showPreviewBtn = false) : (this.showPreviewBtn = true);
        stepper.next();
      } else if (this.value === 'googleAdExchange') {
        this.result = this.transformAdExchange(
          this.code,
          this.googleAddExchangeObjectKeys,
          this.googleAddExchangeValues,
          this.googleAddExchangeObject,
          this.spotxChannelId
        );

        this.result.includes('Error') ? (this.showPreviewBtn = false) : (this.showPreviewBtn = true);
        stepper.next();
      } else if (this.value === 'googleGPT') {
        this.openSnackBar('Work in Progress!', '');
        return;
      } else if (this.value === 'googleGPTShort') {
        this.result = this.transformGPTShort(this.code, this.googleGPTShortObjectKeys, this.googleGPTShortObject, this.spotxChannelId);
        this.result.includes('Error') ? (this.showPreviewBtn = false) : (this.showPreviewBtn = true);
        stepper.next();
      } else if (this.value === 'yandex') {
        if (this.width === undefined || this.width === '' || this.height === undefined || this.height === '') {
          this.openSnackBar('Please, Enter a Width and Height Value!', '');
          return;
        }

        this.result = this.transformYandex(
          this.code,
          this.yandexObjectKeys,
          this.yandexObjectValues,
          this.yandexObject,
          this.spotxChannelId,
          this.width,
          this.height
        );

        this.result.includes('Error') ? (this.showPreviewBtn = false) : (this.showPreviewBtn = true);
        stepper.next();
      } else {
        return;
      } 
    } else { this.openSnackBar('No code was provided!', ''); }

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }

  generateParamFields() {
    this.disableCodeInput = false;
    this.code = '';
    this.result = '';
    this.showChannelInput = true;
    this.value === 'criteo' || this.value === 'yandex' ? (this.showWidthHeightPanel = true) : (this.showWidthHeightPanel = false);
    this.showPreviewBtn = false;
    this.showDestroyPreviewBtn = false;
    this.showPreviewContainer = false;
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
}
