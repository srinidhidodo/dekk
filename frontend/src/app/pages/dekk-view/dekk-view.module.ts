import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'app/common/components/card';

import { ThemeModule } from 'theme';

import { SingleDekkComponent } from '../../common/components/single-dekk';
import { DekkViewComponent } from './dekk-view.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
    CardModule,
  ],
  declarations: [
    DekkViewComponent,
    SingleDekkComponent,
  ],
  exports: [
  ],
})
export class DekkViewModule { }
