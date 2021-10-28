import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
  export class HttpClientService {
  constructor(private http: HttpClient) { }

  public get(url: string, parameters?: {key: string, value: string}[]): Observable<any> {
    let queryString = '';
    if (parameters) {
      queryString = '?';
      parameters.forEach(parameter => {
        queryString += parameter.key + '=' + parameter.value;
      });
    }
    return this.http.get<any>(url + queryString);
  }

  public post(url: string, postBody: any): any {
    return this.http.post<any>(url, postBody);
  }
}
