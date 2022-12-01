import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoPlayerGeneratorComponent } from './video-player-generator.component';
import { MatCardModule } from '@angular/material/card';
import { VideoPlayerGeneratorControlsComponent } from './video-player-generator-controls/video-player-generator-controls.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompletePaginationModule } from 'shared/components/mat-autocomplete-pagination/mat-autocomplete-pagination.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { ControlErrorDirective } from 'shared/directives/control-error.directive/control-error.directive';
import { CustomFormsModule } from 'ngx-custom-validators';
import { ChangeInputOnWheelDirective } from 'shared/directives/change-input-on-wheel.directive';
import { OnlyNumbersDirective } from 'shared/directives/only-numbers.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { DomainListComponent } from './video-player-generator-controls/domain-list/domain-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectSearchModule } from "shared/components/input/search/mat-select-search/mat-select-search.module";

@NgModule({
  exports: [VideoPlayerGeneratorComponent, ControlErrorDirective, ChangeInputOnWheelDirective, OnlyNumbersDirective],
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    FlexModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompletePaginationModule,
    NgxPermissionsModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule,
    CustomFormsModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatDividerModule,
    TranslateModule,
    FormsModule,
    MatSelectSearchModule
  ],
  declarations: [
    OnlyNumbersDirective,
    VideoPlayerGeneratorComponent,
    VideoPlayerGeneratorControlsComponent,
    ControlErrorDirective,
    ChangeInputOnWheelDirective,
    DomainListComponent
  ]
})
export class VideoPlayerGeneratorModule {}
