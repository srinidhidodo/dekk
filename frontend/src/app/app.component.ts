import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dekk-new';
  isDarkThemeEnabled: boolean = true;
  sidebarOpened: boolean = false;
  listItems = [
    { name: 'Search Results', link: '/search-results' },
    { name: 'Card View Details', link: '/card-view-details' },
    { name: 'Study Card', link: '/study-card' },
    { name: 'Login', link: '/login' },
    { name: 'Sign Up', link: '/sign-up' },
  ];
}
