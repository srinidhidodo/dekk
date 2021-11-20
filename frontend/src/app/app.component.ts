import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import rxmq from 'rxmq';
import { MessageConstants } from './common/constants/message.constants';
import { UrlConstants } from './common/constants/url.constants';
import { SearchService } from './common/services/search.service';
import { UserService } from './common/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(MatSidenav)
  sidenav: MatSidenav;


  title = 'dekk-new';
  isDarkThemeEnabled: boolean = true;
  sidebarOpened: boolean = false;
  listItems = [
    { name: 'Home', link: UrlConstants.HOME },
    { name: 'Search Results', link: UrlConstants.SEARCH_RESULTS },
    { name: 'Card View Details', link: '/card-view-details' },
    { name: 'Study Card', link: UrlConstants.STUDY_CARD },
    { name: 'Login', link: '/login' },
    { name: 'Sign Up', link: '/sign-up' },
    { name: 'Create', link: UrlConstants.CREATE }
  ];

  searchSender: Subject<any>;

  constructor(private router: Router,
    private searchService: SearchService,
    private observer: BreakpointObserver,
    private userService: UserService,
    private dialog: MatDialog) {
    
    this.searchSender = rxmq.channel(MessageConstants.SEARCH_CHANNEL)
      .subject(MessageConstants.SEARCH_TRIGGERED_ACTION);
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 1300px)']).subscribe((res: BreakpointState) => {
      if (res.matches) {
        this.sidenav.mode = "over";
        this.sidebarOpened = false;
      } else {
        this.sidenav.mode = "side";
        this.sidebarOpened = true;
      }
    });
  }

  handleSidenavClick(): void {
    if (this.sidenav.mode === "over") {
      this.sidebarOpened = !this.sidebarOpened;
    }
  }
    

  submitSearch(searchString: any): void {
    this.searchService.currentSearch = searchString;
    this.router.navigate(['/search-results']);
    if (this.router.url === UrlConstants.SEARCH_RESULTS) {
      this.searchSender.next({ searchString });
    }
  }

  goToHomePage(): void {
    this.router.navigate([UrlConstants.HOME]);
  }

  goToCreateView(): void {
    this.router.navigate([UrlConstants.CREATE]);
  }
}
