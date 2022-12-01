import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';

// Components
import { AdPreviewComponent } from './ad-preview/ad-preview.component';

@NgModule({
  imports: [CommonModule, MatCardModule, FlexLayoutModule, TranslateModule.forChild(), NgxPermissionsModule.forChild()],
  exports: [AdPreviewComponent],
  declarations: [AdPreviewComponent]
})
export class AdvertisingModule {}
