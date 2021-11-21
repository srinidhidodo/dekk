import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import rxmq from 'rxmq';
import { LoginDialogComponent } from './common/components/login-dialog/login-dialog.component';
import { SignupDialogComponent } from './common/components/signup-dialog/signup-dialog.component';
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
    // { name: 'Website', link: UrlConstants.LANDING },
    { name: 'Home', link: UrlConstants.HOME },
    { name: 'Profile', link: UrlConstants.HOME },
    { name: 'About Us', link: UrlConstants.ABOUT_US },
    { name: 'Bookmarks', link: UrlConstants.HOME },
    // { name: 'Search Results', link: UrlConstants.SEARCH_RESULTS },
    // { name: 'Card View Details', link: '/card-view-details' },
    // { name: 'Study Card', link: UrlConstants.STUDY_CARD },
    // { name: 'Login', link: '/login' },
    // { name: 'Sign Up', link: '/sign-up' },
    // { name: 'Create', link: UrlConstants.CREATE }
  ];

  listItemsBelowDivider = [
    { name: 'Why Dekk?', link: UrlConstants.HOME },
    { name: 'Contact Us', link: UrlConstants.HOME }
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

  isLoggedIn(): boolean {
    return this.userService.loggedIn;
  }
    
  loginClicked(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      data: {},
      panelClass: 'filter-popup'
    });
  }
    
  signupClicked(): void {
    const dialogRef = this.dialog.open(SignupDialogComponent, {
      data: {},
      panelClass: 'filter-popup'
    });
  }
  
  goToAboutUs(): void {
    this.router.navigate([UrlConstants.ABOUT_US]);
  }
}
