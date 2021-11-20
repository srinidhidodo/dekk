import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
  export class HttpClientService {
  constructor(private http: HttpClient, private userService: UserService) { }

  public get(url: string, parameters?: {key: string, value: string}[]): Observable<any> {
    let queryString = '';
    if (parameters) {
      queryString = '?';
      parameters.forEach(parameter => {
        queryString += parameter.key + '=' + parameter.value + '&';
      });
    }
    return this.http.get<any>(url + queryString, {
      headers: new HttpHeaders({
        Authorization: this.userService.accessToken
      })
    });
  }

  public post(url: string, postBody: any): any {
    return this.http.post<any>(url, postBody, {
      headers: new HttpHeaders({
        Authorization: this.userService.accessToken
      })
    });
  }

  public postWithoutAuth(url: string, postBody: any): any {
    return this.http.post<any>(url, postBody);
  }
}
