import { Component, Directive, Input, OnInit } from '@angular/core';
import { Card } from '../../../models/card';
import { StudyService } from '../../../services/study.service';
import { CardUtils } from '../../../utils/card.utils';
import rxmq from 'rxmq';
import { Subject } from 'rxjs';
import { MessageConstants } from 'src/app/common/constants/message.constants';

@Component({
  selector: 'app-card-front',
  templateUrl: './card-front.component.html',
  styleUrls: ['./card-front.component.scss']
})
export class CardFrontComponent implements OnInit {

  @Input()
  card: Card;

  flipToBackObservable: Subject<any>;

  constructor(public studyService: StudyService) {
    this.flipToBackObservable = rxmq.channel(MessageConstants.STUDY_CHANNEL)
      .subject(MessageConstants.STUDY_FLIP_TO_BACK_ACTION);
  }

  ngOnInit(): void {
    this.card = this.studyService.card;
  }

  getCardDekk(): string {
    return CardUtils.getCardDekkText(this.card);
  }

  flipToBack(): void {
    this.flipToBackObservable.next({
      title: 'flipToBack',
      text: 'Flip to back',
    });
  }
}
