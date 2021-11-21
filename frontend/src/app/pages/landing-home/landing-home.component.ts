import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignupDialogComponent } from 'src/app/common/components/signup-dialog/signup-dialog.component';

@Component({
  selector: 'app-landing-home',
  templateUrl: './landing-home.component.html',
  styleUrls: ['./landing-home.component.scss']
})
export class LandingHomeComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  signupClicked(): void {
    const dialogRef = this.dialog.open(SignupDialogComponent, {
      data: {},
      panelClass: 'filter-popup'
    });
  }

}
