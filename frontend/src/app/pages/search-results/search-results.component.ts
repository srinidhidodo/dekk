import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SearchService } from "src/app/common/services/search.service";
import { UrlConstants } from './../../common/constants/url.constants';

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
  offset = new BehaviorSubject(null);

  constructor(public searchService: SearchService) { }

  ngOnInit() { }

  ngOnDestroy() { }

  search(): void {
    this.searchActive = false;
    this.searchService.loadSearchResults([]).subscribe((data: any) => {
      this.searchResultList = data.results.cards;
      this.searchActive = true;
    });
  }

  getNextBatch(): void {
    if (this.searchActive) { // because this should only be allowed when there are already initial search results rendered
      const endData = this.viewport.getRenderedRange().end;

      if (endData === this.searchResultList.length) {
        this.searchService.loadSearchResults([]).subscribe((data: any) => {
          this.searchResultList = [...this.searchResultList, ...data.results.cards];
        });
      }
    }
  }
}
