import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Md5 } from 'ts-md5';
import { UrlConstants } from '../../constants/url.constants';
import { CollegeService } from '../../services/college.service';
import { HttpClientService } from '../../services/http-client.service';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent implements OnInit {
  name: string;
  email: string;
  username: string;
  password: string;
  selectedCollege: string;
  signUpError = false;
  signUpSuccess = false;

  // collegeList: string[];

  constructor(public dialogRef: MatDialogRef<SignupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpClientService: HttpClientService,
    public collegeService: CollegeService) { }

  ngOnInit(): void {
    // this.collegeList = [
    //   'Andaman & Nicobar Islands Institute of Medical Sciences, Port Blair',
    //   'ACSR Government Medical College Nellore',
    //   'All India Institute of Medical Sciences, Mangalagiri, Vijayawada'
    // ];
    // this.selectedCollege = this.collegeService.collegeList[0];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  signUp(): void {
    const signUpReq = {
      user_name: this.username,
      full_name: this.name,
      email: this.email,
      password: Md5.hashStr(this.password),
      college: this.selectedCollege
    };
    this.httpClientService.postWithoutAuth(UrlConstants.REGISTER_URL, signUpReq)
      .subscribe((response: any) => {
        this.signUpError = false;
        this.signUpSuccess = true; // in case of 200 OK
    }, (error: any) => { // TODO: Differentiate between errors
      this.signUpSuccess = false;
      this.signUpError = true;
    });
  }
}
