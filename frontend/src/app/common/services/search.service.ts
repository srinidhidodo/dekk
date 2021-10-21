import { Injectable } from '@angular/core';
import { UrlConstants } from '../constants/url.constants';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private httpClientService: HttpClientService) { }

  public loadSearchResults(searchTags: string[]): any {
      return this.httpClientService.post(UrlConstants.SEARCH_URL, searchTags);
    }
}
