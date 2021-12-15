import { Injectable } from '@angular/core';
import { UrlConstants } from '../constants/url.constants';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class CollegeService {

  isLoading = true;

  constructor(private httpClientService: HttpClientService) {
    // this.loadColleges();
  }

  private _collegeList: string[] = [];

  public loadColleges(): any {
    const returnObservable = this.httpClientService.getWithoutAuth(UrlConstants.GET_COLLEGES_URL);

    // This is to ensure the tags list maintained in this service remains updated at any point of time
    returnObservable.subscribe((collegesData: string[]) => {
      this._collegeList = collegesData;
      this.isLoading = false;
    });
    
    return returnObservable;
  }

  public get collegeList(): string[] {
    return this._collegeList;
  }
}
