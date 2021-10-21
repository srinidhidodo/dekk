import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Event, NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Card } from "src/app/common/models/card";
import { StudyService } from "src/app/common/services/study.service";
import { CardUtils } from "src/app/common/utils/card.utils";
import { trigger, state, style, transition, animate } from '@angular/animations';
import rxmq from 'rxmq';
import { MessageConstants } from "src/app/common/constants/message.constants";

@Component({
  selector: 'app-study-card',
  styleUrls: ['./study-card.component.scss'],
  templateUrl: './study-card.component.html',
  animations: [
    trigger('flipState', [
      state('active', style({
        transform: 'rotateY(180deg)'
      })),
      state('inactive', style({
        transform: 'rotateY(0deg)'
      })),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in'))
    ])
  ]
})
export class StudyCardComponent implements OnInit, OnDestroy {
  
  @Input()
  card: Card;

  visibleFront = true;
  flip: string = 'inactive';

  flipToFrontSubscription: Subscription;
  flipToBackSubscription: Subscription;

  constructor(private router: Router, public studyService: StudyService) {}

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.visibleFront = true;
        this.flip = 'inactive';
        this.card = this.studyService.card;
      }
    });

    this.flipToFrontSubscription = rxmq.channel(MessageConstants.STUDY_CHANNEL)
      .observe(MessageConstants.STUDY_FLIP_TO_FRONT_ACTION)
      .subscribe(() => { this.flipToFront(); });

    this.flipToBackSubscription = rxmq.channel(MessageConstants.STUDY_CHANNEL)
      .observe(MessageConstants.STUDY_FLIP_TO_BACK_ACTION)
      .subscribe(() => { this.flipToBack(); });
  }

  ngOnDestroy() { }

  getCardCategory(): string {
    return CardUtils.getCardCategoryText(this.card);
  }

  flipToFront() {
    this.toggleFlip();
    setTimeout(() => {this.visibleFront = true;}, 250);
  }

  flipToBack() {
    this.toggleFlip();
    setTimeout(() => {this.visibleFront = false;}, 250);
  }

  isCardFrontVisible(): boolean {
    return this.visibleFront;
  }

  toggleFlip() {
    this.flip = (this.flip == 'inactive') ? 'active' : 'inactive';
  }
}
