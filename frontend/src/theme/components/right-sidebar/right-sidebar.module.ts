import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from 'app/common/components/card';

import { RightSidebarContentComponent } from './content';
import { RightSidebarLayoutComponent } from './right-sidebar.component';
import { RightSidebarComponent } from './sidebar';

@NgModule({
  imports: [
    CommonModule,
    CardModule,
  ],
  declarations: [
    RightSidebarLayoutComponent,
    RightSidebarComponent,
    RightSidebarContentComponent,
  ],
  exports: [
    RightSidebarLayoutComponent,
    RightSidebarContentComponent,
    RightSidebarComponent,
  ],
})
export class RightSidebarModule { }
