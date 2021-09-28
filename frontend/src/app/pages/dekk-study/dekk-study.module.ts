import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'app/common/components/card';
import { DekkCardBackComponent } from 'app/common/components/dekk-card-back';
import { DekkCardFrontComponent } from 'app/common/components/dekk-card-front';

import { ThemeModule } from 'theme';

import { DekkStudyComponent } from './dekk-study.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
    CardModule,
  ],
  declarations: [
    DekkStudyComponent,
    DekkCardFrontComponent,
    DekkCardBackComponent,
  ],
  exports: [
  ],
})
export class DekkStudyModule { }
