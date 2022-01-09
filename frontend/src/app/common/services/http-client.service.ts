import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import { UrlConstants } from '../constants/url.constants';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
  export class HttpClientService {
  constructor(private http: HttpClient, private userService: UserService, private dialog: MatDialog, private router: Router) { }

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

    const observable = this.http.get<any>(url + queryString, {
      headers: new HttpHeaders({
        Authorization: this.userService.accessToken
      })
    }).pipe(share());
    observable.subscribe(() => {}, (error: any) => {
      if (error?.status === 401) {
        this.userService.logout();
        this.router.navigate([UrlConstants.LANDING]);
      }
    });
    return observable;
  }

  public post(url: string, postBody: any): any {
    const observable = this.http.post<any>(url, postBody, {
      headers: new HttpHeaders({
        Authorization: this.userService.accessToken
      })
    }).pipe(share());
    observable.subscribe(() => {}, (error: any) => {
      if (error?.status === 401) {
        this.userService.logout();
        this.router.navigate([UrlConstants.LANDING]);
      }
    });
    return observable;
  }

  public put(url: string, postBody: any): any {
    const observable = this.http.put<any>(url, postBody, {
      headers: new HttpHeaders({
        Authorization: this.userService.accessToken
      })
    }).pipe(share());
    observable.subscribe(() => {}, (error: any) => {
      if (error?.status === 401) {
        this.userService.logout();
        this.router.navigate([UrlConstants.LANDING]);
      }
    });
    return observable;
  }

  public delete(url: string): any {
    const observable = this.http.delete<any>(url, {
      headers: new HttpHeaders({
        Authorization: this.userService.accessToken
      })
    }).pipe(share());
    observable.subscribe(() => {}, (error: any) => {
      if (error?.status === 401) {
        this.userService.logout();
        this.router.navigate([UrlConstants.LANDING]);
      }
    });
    return observable;
  }

  public getWithoutAuth(url: string, parameters?: {key: string, value: string}[]): any {
    let queryString = '';
    if (parameters) {
      queryString = '?';
      parameters.forEach(parameter => {
        queryString += parameter.key + '=' + parameter.value + '&';
      });
    }
    return this.http.get<any>(url + queryString).pipe(share());
  }

  public postWithoutAuth(url: string, postBody: any): any {
    return this.http.post<any>(url, postBody).pipe(share());
  }
}
