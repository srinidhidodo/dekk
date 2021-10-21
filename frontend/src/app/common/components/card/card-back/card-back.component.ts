import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Card } from 'src/app/common/models/card';
import { StudyService } from 'src/app/common/services/study.service';
import rxmq from 'rxmq';
import { MessageConstants } from 'src/app/common/constants/message.constants';
import { CardUtils } from 'src/app/common/utils/card.utils';

@Component({
  selector: 'app-card-back',
  templateUrl: './card-back.component.html',
  styleUrls: ['./card-back.component.scss']
})
export class CardBackComponent implements OnInit {

  @Input()
  card: Card;

  flipToFrontObservable: Subject<any>;

  constructor(public studyService: StudyService) {
    this.flipToFrontObservable = rxmq.channel(MessageConstants.STUDY_CHANNEL)
      .subject(MessageConstants.STUDY_FLIP_TO_FRONT_ACTION);
  }

  ngOnInit(): void {
    this.card = this.studyService.card;
  }

  getCardDekk(): string {
    return CardUtils.getCardDekkText(this.card);
  }

  flipToFront(): void {
    this.flipToFrontObservable.next({
      title: 'flipToFront',
      text: 'Flip to front',
    });
  }
}
