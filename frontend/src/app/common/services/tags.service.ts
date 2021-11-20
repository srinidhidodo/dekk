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
      const returnObservable = this.httpClientService.get(UrlConstants.GET_TAGS_URL);

      // This is to ensure the tags list maintained in this service remains updated at any point of time
      returnObservable.subscribe((tagsData: any) => {
        this._tagsList = tagsData?.tags;
      });
      
      return returnObservable;
    }

    public get tagsList(): string[] {
      return this._tagsList;
    }
}
