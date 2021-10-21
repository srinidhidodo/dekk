import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
  export class HttpClientService {
  constructor(private http: HttpClient) { }

  public get(url: string, parameters?: {key: string, value: string}[]): Observable<any> {
    const httpParams = new HttpParams();
    if (parameters) {
      parameters.forEach(parameter => {
        httpParams.set(parameter.key, parameter.value);
      });
    }
    return this.http.get<any>(url, { params: httpParams });
  }

  public post(url: string, postBody: any): any {
    return this.http.post<any>(url, postBody);
  }
}
