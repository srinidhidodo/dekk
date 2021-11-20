import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RatingModel } from '../../models/rating-model';

@Component({
  selector: 'app-rating-dialog',
  templateUrl: './rating-dialog.component.html',
  styleUrls: ['./rating-dialog.component.scss']
})
export class RatingDialogComponent implements OnInit {

  dekkOrCard: string = 'Dekk';

  constructor(
    public dialogRef: MatDialogRef<RatingDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: RatingModel) { }

  ngOnInit(): void {
    if (this.data?.card_id) {
      this.dekkOrCard = 'Card';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
