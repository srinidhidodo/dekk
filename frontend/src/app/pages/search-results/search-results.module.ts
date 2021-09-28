import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'app/common/components/card';

import { ThemeModule } from 'theme';
import { SearchResultsComponent } from './search-results.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
    CardModule,
  ],
  declarations: [
    SearchResultsComponent,
  ],
  exports: [
  ],
})
export class SearchResultsModule { }
