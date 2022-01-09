import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UrlConstants } from "../constants/url.constants";
import { Card } from "../models/card";
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

    public loadCardByCardId(card_id: string): Observable<any> {
      return this.httpClientService.get(UrlConstants.CARD_DATA_URL + '/' + card_id, []);
    }

    public saveDekkMetadata(dekk_name: string, dekk_id?: string): Observable<any> {
      const saveBody = dekk_id ? { dekk_name, dekk_id } : { dekk_name };
      return this.httpClientService.post(UrlConstants.SAVE_DEKK_DETAILS, saveBody);
    }

    public saveCard(card: any, card_id?: string): Observable<any> {
      if (card_id) {
        // replace this with put call
        card.card_id = card_id;
        return this.httpClientService.put(UrlConstants.SAVE_CARD_DATA_URL, card);
      } else {
        return this.httpClientService.post(UrlConstants.SAVE_CARD_DATA_URL, card);
      }
    }

    public deleteCard(card_id?: string): Observable<any> {
      return this.httpClientService.delete(UrlConstants.DELETE_CARD_URL + '/' + card_id);
    }

    public saveSubdekk(master_dekk_id: string, sub_master_name: string): Observable<any> {
      return this.httpClientService.post(UrlConstants.CREATE_SUBDEKK_URL, {    
        master_dekk_id,
        sub_master_name
      });
    }
  
    unsetCurrentSearch(): void {
      this.currentSearch = undefined;
    }
  }
  