import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Card } from 'src/app/common/models/card';
import { StudyService } from 'src/app/common/services/study.service';
import rxmq from 'rxmq';
import { MessageConstants } from 'src/app/common/constants/message.constants';
import { CardUtils } from 'src/app/common/utils/card.utils';
import { MatDialog } from '@angular/material/dialog';
import { RatingDialogComponent } from '../../rating-dialog/rating-dialog.component';
import { ImgDialogComponent } from '../../img-dialog/img-dialog.component';

@Component({
  selector: 'app-card-back',
  templateUrl: './card-back.component.html',
  styleUrls: ['./card-back.component.scss']
})
export class CardBackComponent implements OnInit, OnChanges {

  @Input()
  card: Card;

  content: string;
  dekkRating: number;
  dekkFeedback: string;

  flipToFrontObservable: Subject<any>;

  rightObervable: Subject<any>;
  wrongObervable: Subject<any>;

  constructor(public studyService: StudyService, public dialog: MatDialog) {
    this.flipToFrontObservable = rxmq.channel(MessageConstants.STUDY_CHANNEL)
      .subject(MessageConstants.STUDY_FLIP_TO_FRONT_ACTION);
    this.rightObervable = rxmq.channel(MessageConstants.RIGHT_WRONG_CHANNEL)
      .subject(MessageConstants.RIGHT_ACTION);
    this.wrongObervable = rxmq.channel(MessageConstants.RIGHT_WRONG_CHANNEL)
      .subject(MessageConstants.WRONG_ACTION);
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    // this.content = this.studyService.getUnhighlightedCardBack();
    this.content = this.studyService.getHighlightedCardBack();
  }

  getCardDekk(): string {
    return CardUtils.getCardCategoryText(this.card);
  }

  highlight(): void {
    this.content = this.studyService.getHighlightedCardBack();
  }

  flipToFront(): void {
    this.flipToFrontObservable.next({
      title: 'flipToFront',
      text: 'Flip to front',
    });
  }

  rateDialog(): void {
    const dialogRef = this.dialog.open(RatingDialogComponent, {
      data: {
        dekk_id: 'dekk1',
        card_id: this.card.card_id,
        current_rating: 3
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dekkRating = result.current_rating;
        this.dekkFeedback = result.feedback;
        console.log('The dialog was closed: ', this.dekkRating, this.dekkFeedback);
      }
    });
  }

  gotItRight(): void {
    if (!this.card.rightWrongMarked) {
      this.rightObervable.next({
        title: 'Right',
        text: 'Right',
      });
      this.card.rightWrongMarked = true;
    }
  }

  gotItWrong(): void {
    if (this.card.rightWrongMarked) {
      this.wrongObervable.next({
        title: 'Wrong',
        text: 'Wrong',
      });
      this.card.rightWrongMarked = true;
    }
  }

  openImg(): void {
    const dialogRef = this.dialog.open(ImgDialogComponent, {
      data: {
          msg: 'https://play-lh.googleusercontent.com/IeNJWoKYx1waOhfWF6TiuSiWBLfqLb18lmZYXSgsH1fvb8v1IYiZr5aYWe0Gxu-pVZX3'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed: ', result);
    });
  }
}
