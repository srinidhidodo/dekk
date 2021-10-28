import { Injectable } from '@angular/core';
import { UrlConstants } from '../constants/url.constants';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  currentSearch: string | undefined;

  constructor(private httpClientService: HttpClientService) { }

  public loadSearchResults(searchString: string, searchTags?: string[]): any {
      // return this.httpClientService.post(UrlConstants.SEARCH_URL, searchTags);
      return this.httpClientService.get(UrlConstants.SEARCH_URL, [{ key: 'q', value: searchString }]);
    }

    unsetCurrentSearch(): void {
      this.currentSearch = undefined;
    }
}
