import { Component, OnInit } from '@angular/core';
import { egretAnimations } from 'shared/animations/egret-animations';

@Component({
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.scss'],
  animations: egretAnimations
})
export class ReportViewerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
