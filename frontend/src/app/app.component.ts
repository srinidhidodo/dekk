import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import rxmq from 'rxmq';
import { MessageConstants } from './common/constants/message.constants';
import { UrlConstants } from './common/constants/url.constants';
import { SearchService } from './common/services/search.service';

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
    { name: 'Home', link: UrlConstants.HOME },
    { name: 'Search Results', link: UrlConstants.SEARCH_RESULTS },
    { name: 'Card View Details', link: '/card-view-details' },
    { name: 'Study Card', link: '/study-card' },
    { name: 'Login', link: '/login' },
    { name: 'Sign Up', link: '/sign-up' },
  ];

  searchSender: Subject<any>;

  constructor(private router: Router, private searchService: SearchService) {
    this.searchSender = rxmq.channel(MessageConstants.SEARCH_CHANNEL)
      .subject(MessageConstants.SEARCH_TRIGGERED_ACTION);
  }

  submitSearch(searchString: any): void {
    this.searchService.currentSearch = searchString;
    this.router.navigate(['/search-results']);
    if (this.router.url === UrlConstants.SEARCH_RESULTS) {
      this.searchSender.next({ searchString });
    }
  }
}
