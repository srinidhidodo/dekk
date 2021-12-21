import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { UrlConstants } from '../constants/url.constants';
import { Tag } from '../models/tag';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class TagsService {

  isLoading: boolean = true;
  tagsList: Tag[] = [];

  constructor(private httpClientService: HttpClientService) {
    // this.loadTags();
  }

  public loadTags(): any {
    if (!this.isLoading) {
      return of(this.tagsList);
    }

    const returnObservable = this.httpClientService.get(UrlConstants.GET_TAGS_URL);

    // This is to ensure the tags list maintained in this service remains updated at any point of time
    returnObservable.subscribe((tagsData: any) => {
      this.tagsList = tagsData;
      this.isLoading = false;
    });
    
    return returnObservable;
  }
}
