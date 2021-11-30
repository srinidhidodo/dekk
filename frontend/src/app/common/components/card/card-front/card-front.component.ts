import { Component, Directive, Input, OnChanges, OnInit } from '@angular/core';
import { Card } from '../../../models/card';
import { StudyService } from '../../../services/study.service';
import { CardUtils } from '../../../utils/card.utils';
import rxmq from 'rxmq';
import { Subject } from 'rxjs';
import { MessageConstants } from 'src/app/common/constants/message.constants';
import { MatDialog } from '@angular/material/dialog';
import { RatingDialogComponent } from '../../rating-dialog/rating-dialog.component';

@Component({
  selector: 'app-card-front',
  templateUrl: './card-front.component.html',
  styleUrls: ['./card-front.component.scss']
})
export class CardFrontComponent implements OnInit, OnChanges {

  @Input()
  card: Card;

  content: string;
  dekkRating: number;
  dekkFeedback: string;

  flipToBackObservable: Subject<any>;

  constructor(public studyService: StudyService, public dialog: MatDialog) {
    this.flipToBackObservable = rxmq.channel(MessageConstants.STUDY_CHANNEL)
      .subject(MessageConstants.STUDY_FLIP_TO_BACK_ACTION);
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    // this.content = this.studyService.getUnhighlightedCardBack();
    this.content = this.studyService.getHighlightedCardFront();
  }

  getCardDekk(): string {
    return CardUtils.getCardCategoryText(this.card);
  }

  flipToBack(): void {
    this.flipToBackObservable.next({
      title: 'flipToBack',
      text: 'Flip to back',
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
}
