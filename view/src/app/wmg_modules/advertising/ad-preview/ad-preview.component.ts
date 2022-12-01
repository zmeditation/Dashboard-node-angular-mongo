import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { egretAnimations } from '../../../shared/animations/egret-animations';

@Component({
  selector: 'app-ad-preview',
  templateUrl: './ad-preview.component.html',
  styleUrls: ['./ad-preview.component.scss'],
  styles: ['.justify-center {display: flex; justify-content: center}'],
  animations: egretAnimations
})
export class AdPreviewComponent implements OnInit, AfterViewInit {
  private isInited: boolean;

  public iframeHeight = 0;

  public iframeWidth = 0;

  public iframeURL: SafeResourceUrl;

  @Input('resultCode') resultCode: string;

  @ViewChild('iframe') iframe: ElementRef;

  @HostListener('window:message', ['$event']) onMessage(e) {
    // console.log(e);
    if (e.data.h && typeof e.data.h === 'number' && e.data.w && typeof e.data.w === 'number') {
      this.iframeHeight = e.data.h;
      this.iframeWidth = e.data.w;
    }
  }

  constructor(public sanitizer: DomSanitizer) {
    this.iframeURL = sanitizer.bypassSecurityTrustResourceUrl(environment.utilities + '/ad-server/4988789498498');
  }

  ngOnInit() {
    if (this.resultCode && this.resultCode.length > 0) { this.resultCode = this.encodeHTML(this.resultCode); } 
    
  }

  ngAfterViewInit() {
    this.isInited = true;
  }

  onIframeLoad() {
    if (this.isInited) {
      setTimeout(() => {
        this.iframe.nativeElement.contentWindow.postMessage({ m: 'preview', c: this.resultCode }, '*');
      }, 500); 
    } 
    
    
  }

  encodeHTML(str) {
    const buf = [];
    for (let i = str.length - 1; i >= 0; i--) { buf.unshift(['&#', str[i].charCodeAt(), ';'].join('')); } 
    
    return buf.join('');
  }
}
