import { Injectable } from '@angular/core';
import { UrlConstants } from '../constants/url.constants';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  currentSearch: string | undefined;

  constructor(private httpClientService: HttpClientService) { }

  public loadSearchResults(searchString: string, offset: number, searchTags?: string[]): any {
      return this.httpClientService.get(UrlConstants.SEARCH_URL, [
        { key: 'q', value: searchString },
        { key: 'offset', value: offset.toString() }
      ]);
    }

    unsetCurrentSearch(): void {
      this.currentSearch = undefined;
    }
}
