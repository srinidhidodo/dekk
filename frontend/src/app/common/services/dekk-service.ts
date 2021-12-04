import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UrlConstants } from "../constants/url.constants";
import { HttpClientService } from "./http-client.service";

@Injectable({
    providedIn: 'root',
  })
  export class DekkService {
    currentSearch: string | undefined;
  
    constructor(private httpClientService: HttpClientService) { }
  
    public loadDekkDetails(dekk_id?: string): Observable<any> {
        return dekk_id ? 
            this.httpClientService.get(UrlConstants.DEKK_DETAILS_URL, [
                { key: 'id', value: dekk_id }
            ])
            : this.httpClientService.get(UrlConstants.DEKK_DETAILS_URL, []);
      }
  
      unsetCurrentSearch(): void {
        this.currentSearch = undefined;
      }
  }
  