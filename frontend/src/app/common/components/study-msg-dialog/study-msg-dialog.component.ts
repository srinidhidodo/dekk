import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UrlConstants } from '../../constants/url.constants';

@Component({
  selector: 'app-study-msg-dialog',
  templateUrl: './study-msg-dialog.component.html',
  styleUrls: ['./study-msg-dialog.component.scss']
})
export class StudyMsgDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<StudyMsgDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  returnHome(): void {
    this.router.navigate([UrlConstants.HOME]);
    this.dialogRef.close();
  }

}
