import { Component, Input } from '@angular/core';

import { SidebarComponent as BaseSidebarComponent } from 'theme/components/sidebar';

@Component({
  selector: 'app-sidebar',
  styleUrls: ['../../../../theme/components/sidebar/sidebar.component.scss', './sidebar.component.scss'],
  templateUrl: '../../../../theme/components/sidebar/sidebar.component.html',
})
export class SidebarComponent extends BaseSidebarComponent {
  public title = 'darkboard';
  public menu = [
    { name: 'Dekk View', link: '/app/dekk-view', icon: 'view_quilt' },
    { name: 'Study', link: '/app/dekk-study', icon: 'view_comfy' },
    { name: 'Search Results', link: '/app/search-results', icon: 'dashboard' },
    { name: 'Classic Dashboard', link: '/app/dashboard', icon: 'dashboard' },
  ];
}
