import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.scss']
})
export class LockscreenComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;

  @ViewChild(MatButton) submitButton: MatButton;

  lockscreenData = {
    password: ''
  };

  constructor() {}

  ngOnInit() {}

  unlock() {
    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';
  }
}
