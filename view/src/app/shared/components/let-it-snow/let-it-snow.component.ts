import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-let-it-snow',
  templateUrl: './let-it-snow.component.html',
  styleUrls: ['./let-it-snow.component.scss']
})
export class LetItSnowComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // @ts-ignore
    if (!top.karma) {
      setTimeout(this.letItSnow, 1000);
    }
  }

  letItSnow() {
    const snowContainer = document.getElementById('let-it-snow');
    snowContainer.style.backgroundColor = 'rgba(16, 74, 94, 0.7)';
  }
}
