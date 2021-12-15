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
      return this.httpClientService.get(UrlConstants.DEKK_DETAILS_URL, []);
    }

    public loadDekkMetadataByDekkId(dekk_id: string): Observable<any> {
      return this.httpClientService.get(UrlConstants.DEKK_METADATA_URL + '/' + dekk_id, []);
    }

    public saveDekkMetadata(dekk_name: string, dekk_id?: string): Observable<any> {
      const saveBody = dekk_id ? { dekk_name, dekk_id } : { dekk_name };
      return this.httpClientService.post(UrlConstants.SAVE_DEKK_DETAILS, saveBody);
    }
  
    unsetCurrentSearch(): void {
      this.currentSearch = undefined;
    }
  }
  