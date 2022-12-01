import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompletePaginationComponent } from './mat-autocomplete-pagination.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MatAutocompletePaginationComponent],
  imports: [CommonModule, MatAutocompleteModule, MatProgressBarModule, MatButtonModule, TranslateModule.forChild()],
  exports: [MatAutocompletePaginationComponent, MatAutocompleteModule]
})
export class MatAutocompletePaginationModule {}
