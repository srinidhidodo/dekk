import { Injectable } from '@angular/core';
import { UrlConstants } from '../constants/url.constants';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
    constructor(private httpClientService: HttpClientService) {
      this.loadTags();
    }

    private _tagsList: string[] = [];

    public loadTags(): any {
      return this.httpClientService.get(UrlConstants.GET_TAGS_URL);
    }

    public get tagsList(): string[] {
      return this._tagsList;
    }
}
