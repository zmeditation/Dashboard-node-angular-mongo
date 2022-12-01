import { Component, ElementRef, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-video-background',
  templateUrl: './video-background.component.html',
  styleUrls: ['./video-background.component.scss']
})
export class VideoBackgroundComponent implements OnInit, AfterViewInit {
  @ViewChild('videoRef') videoRef: ElementRef;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.videoRef) { this.videoRef.nativeElement.muted = true; } 
  }

  get isMobile() {
    return this.breakpointObserver.isMatched('(max-width: 767px)');
  }
}
