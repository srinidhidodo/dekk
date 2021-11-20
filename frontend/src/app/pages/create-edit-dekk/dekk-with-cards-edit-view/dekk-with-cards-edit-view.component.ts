import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RatingDialogComponent } from 'src/app/common/components/rating-dialog/rating-dialog.component';
import { UrlConstants } from 'src/app/common/constants/url.constants';
import { Card } from 'src/app/common/models/card';
import { CardUtils } from 'src/app/common/utils/card.utils';

@Component({
  selector: 'app-dekk-with-cards-edit-view',
  templateUrl: './dekk-with-cards-edit-view.component.html',
  styleUrls: ['./dekk-with-cards-edit-view.component.scss']
})
export class DekkWithCardsEditViewComponent implements OnInit {

  @Input()
  dekkName: string = "Test Dekk";

  @Input()
  dekkTagsList: string[] = ["something", "hogwarts"];

  cardsList: any[] = [
    {title: 'Card 1', card: 'Card somthing 1'},
    {title: 'Card 2', card: 'somethign 2'},
    {title: 'Card 1', card: 'Card somthing 1'},
    {title: 'Card 2', card: 'somethign 2'},
    {title: 'Card 1', card: 'Card somthing 1'},
    {title: 'Card 2', card: 'somethign 2'},
    {title: 'Card 1', card: 'Card somthing 1'},
    {title: 'Card 2', card: 'somethign 2'},
    {title: 'Card 1', card: 'Card somthing 1'},
    {title: 'Card 2', card: 'somethign 2'},
    {title: 'Card 1', card: 'Card somthing 1'},
    {title: 'Card 2', card: 'somethign 2'},
  ];

  displayedColumns = ["card", "action"];
  dekkRating: number;
  dekkFeedback: string;

  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  getCardCategory(): string {
    return "Personal";
  }

  addCard(): void {
    this.router.navigate([UrlConstants.CARD_EDIT_VIEW]);
  }

  rateDialog(): void {
    const dialogRef = this.dialog.open(RatingDialogComponent, {
      data: {
        dekk_id: 'dekk1',
        current_rating: 3
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dekkRating = result.current_rating;
      this.dekkFeedback = result.feedback;
      console.log('The dialog was closed: ', result);
    });
  }
}
