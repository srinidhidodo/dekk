import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    private userService: UserService) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  login(): void {
    const loginReq = {
      email: this.email,
      password: this.password
    };
    this.httpClientService.postWithoutAuth(UrlConstants.LOGIN_URL, loginReq)
      .subscribe((response: any) => {
        this.loginError = true;
        this.loginSuccess = true; // in case of 200 OK
        this.userService.loggedIn = true;
        this.userService.accessToken = response?.auth_token;
    }, (error: any) => { // TODO: Differentiate between errors
      this.loginSuccess = false;
      this.loginError = true;
    });
  }
}
