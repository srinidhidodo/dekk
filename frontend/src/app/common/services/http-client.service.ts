import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
  export class HttpClientService {
  constructor(private http: HttpClient, private userService: UserService, private dialog: MatDialog) { }

  public get(url: string, parameters?: {key: string, value: string}[]): Observable<any> {
    let queryString = '';
    if (parameters) {
      queryString = '?';
      parameters.forEach(parameter => {
        queryString += parameter.key + '=' + parameter.value + '&';
      });
    }

    if (!this.userService.loggedIn) {
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        data: {},
        panelClass: 'filter-popup'
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
