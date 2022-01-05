import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5';
import { UrlConstants } from '../../constants/url.constants';
import { HttpClientService } from '../../services/http-client.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  email: string;
  password: string;

  loginError = false;
  loginSuccess = false;

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpClientService: HttpClientService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  login(): void {
    const loginReq = {
      email: this.email,
      password: Md5.hashStr(this.password)
    };
    this.httpClientService.postWithoutAuth(UrlConstants.LOGIN_URL, loginReq)
      .subscribe((response: any) => {
        this.loginError = false;
        this.loginSuccess = true; // in case of 200 OK
        this.userService.loginSuccessful(response?.auth_token);
        this.dialogRef.close();
        this.router.navigate([UrlConstants.HOME]);
    }, (error: any) => { // TODO: Differentiate between errors
      this.loginSuccess = false;
      this.loginError = true;
    });
  }
}
