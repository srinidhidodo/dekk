import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as $ from 'jquery';

@Component({
  selector: 'app-img-dialog',
  templateUrl: './img-dialog.component.html',
  styleUrls: ['./img-dialog.component.scss']
})
export class ImgDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ImgDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    // setTimeout(() => { $('#enlargedPopupImg').height($('#enlargedPopupImg').width()!); });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
