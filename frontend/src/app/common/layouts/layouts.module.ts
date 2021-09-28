import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from 'app/common/components/sidebar';
import { ThemeModule } from 'theme';
import { CommonLayoutComponent } from './common-layout';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    RouterModule,
  ],
  declarations: [
    CommonLayoutComponent,
    SidebarComponent,
  ],
  exports: [
    CommonLayoutComponent,
  ],
})
export class LayoutsModule { }
