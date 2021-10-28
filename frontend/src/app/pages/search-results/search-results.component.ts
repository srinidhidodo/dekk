import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { SearchService } from "src/app/common/services/search.service";
import rxmq from 'rxmq';
import { MessageConstants } from "src/app/common/constants/message.constants";

@Component({
  selector: 'app-search-results',
  styleUrls: ['./search-results.component.scss'],
  templateUrl: './search-results.component.html'
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  
  @ViewChild(CdkVirtualScrollViewport, {static: false})
  viewport: CdkVirtualScrollViewport;
  
  searchResultList: any[] = [];
  searchKeyword: string = '';
  searchActive: boolean = false;
  searchInitialLoading: boolean = false;
  offset = new BehaviorSubject(null);

  searchSubscription: Subscription;

  constructor(public searchService: SearchService) {
  }

  ngOnInit() {
    this.searchSubscription = rxmq.channel(MessageConstants.SEARCH_CHANNEL)
    .observe(MessageConstants.SEARCH_TRIGGERED_ACTION)
    .subscribe((data: any) => {
      this.searchKeyword = data?.searchString;
      if (this.searchKeyword) {
        this.search();
      }
    });
    if (this.searchService.currentSearch) {
      this.search();
    }
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    this.searchService.unsetCurrentSearch();
  }

  submitSearch(): void {
    this.searchService.currentSearch = this.searchKeyword;
    this.search();
  }

  search(): void {
    this.searchActive = false;
    this.searchInitialLoading = true;
    if (this.searchService.currentSearch) {
      this.searchKeyword = this.searchService.currentSearch;
      this.searchService.loadSearchResults(this.searchService.currentSearch, []).subscribe((data: any) => {
        this.searchResultList = data;
        this.searchActive = true;
        this.searchInitialLoading = false;
      });
    }
  }

  getNextBatch(): void {
    if (this.searchActive) { // because this should only be allowed when there are already initial search results rendered
      const endData = this.viewport.getRenderedRange().end;

      if (endData === this.searchResultList.length) {
        this.searchService.loadSearchResults(this.searchKeyword, []).subscribe((data: any) => {
          this.searchResultList = [...this.searchResultList, ...data.results.cards];
        });
      }
    }
  }
}
