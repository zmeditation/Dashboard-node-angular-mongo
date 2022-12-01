import { Component, OnDestroy } from '@angular/core';
import { IVideoPlayerParamsInterface } from './video-player-generator-controls/interfaces/video-player-params.interface';
// @ts-ignore
import template from 'html-loader!./data/player-template.html';
import { Clipboard } from '@angular/cdk/clipboard';
import { CONFIGS } from './data/configs';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { ATTRIBUTES } from './data/player-attributes';

@Component({
  selector: 'app-video-player-generator',
  templateUrl: './video-player-generator.component.html',
  styleUrls: ['./video-player-generator.component.scss']
})
export class VideoPlayerGeneratorComponent implements OnDestroy {
  public panelOpenState = false;

  public template!: string;

  public generated = false;

  public domains: Observable<any[]>;

  private subscription = new Subscription();

  public controls = {
    showControls: new BehaviorSubject(false),
    analytics: new BehaviorSubject(false),
    unitNameEnabled: new BehaviorSubject(false),
    unitName: new BehaviorSubject('')
  };

  constructor(private clipboard: Clipboard) {
    // Empty
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onPropertiesChange(params: IVideoPlayerParamsInterface): void {
    this.updateTemplate(params);
    this.subscription.unsubscribe();

    this.subscription = combineLatest([
      this.controls.showControls,
      this.controls.analytics,
      this.controls.unitNameEnabled,
      this.controls.unitName
    ]).subscribe(() => this.updateTemplate(params));
  }

  public onshowControlsToggle(checked: boolean): void {
    this.controls.showControls.next(checked);
  }


  public copyCode(code: string): void {
    this.clipboard.copy(code);
  }

  private updateTemplate(params: IVideoPlayerParamsInterface): void {
    const { showControls, analytics, unitNameEnabled, unitName } = this.controls;
    const secondaryAttributes = [
      [showControls, ATTRIBUTES.SHOW_CONTROLS],
      [analytics, ATTRIBUTES.ANALYTICS],
      [unitNameEnabled, ATTRIBUTES.UNIT_NAME_ENABLED]
    ]
      .filter((item) => (item[0] as BehaviorSubject<boolean>).getValue())
      .map((item) => {
        const attr = item[1];

        if (attr === ATTRIBUTES.ANALYTICS) {
          return attr.replace('{{ PUB_ID }}', params.publisher);
        }
        if (attr === ATTRIBUTES.UNIT_NAME_ENABLED) {
          
          return attr.replace('{{ UNIT_NAME }}', unitName.getValue());
        }

        return attr;
      });

    this.generated = true;

    this.template = template
      .replace('{{WIDTH}}', String(params.width))
      .replace('{{HEIGHT}}', String(params.height))
      .replace('{{VAST_TAG}}', params.vastUrl)
      .replace('{{SECONDARY_ATTRIBUTES}}', secondaryAttributes.join(' '));
  }
}
