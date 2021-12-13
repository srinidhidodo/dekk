import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Event, NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Card } from "src/app/common/models/card";
import { StudyService } from "src/app/common/services/study.service";
import { CardUtils } from "src/app/common/utils/card.utils";
import { trigger, state, style, transition, animate } from '@angular/animations';
import rxmq from 'rxmq';
import { MessageConstants } from "src/app/common/constants/message.constants";
import { PunsConstants } from "src/app/common/constants/puns.constants";

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
  
  // @Input()
  card: Card = CardUtils.getWaitCard();

  // @Input()
  ids: string[]; // change to dekk id

  visibleFront = true;
  flip: string = 'inactive';

  flipToFrontSubscription: Subscription;
  flipToBackSubscription: Subscription;
  rightWrongSubscription: Subscription;

  // For loading screen
  // for initial load - isNewDekkLoaded && isMinLoadTimeElapsed
  isNewDekkLoaded = false; // for initial load
  isMinLoadTimeElapsed = false; // for initial load
  isLoading = false; // for general loads

  constructor(private router: Router, public studyService: StudyService) {}

  ngOnInit() {
    this.ids = this.studyService.selectedIds;
    
    this.isLoading = true;
    this.isNewDekkLoaded = false;
    this.isMinLoadTimeElapsed = false;
    setTimeout(() => {
      this.isMinLoadTimeElapsed = true;
    }, 8000);
    
    this.studyService.loadNewDekk(this.ids).subscribe(response => {
      this.isNewDekkLoaded = true;
      this.isLoading = false;
      this.card = this.studyService.getCurrentCard();
    });

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.visibleFront = true;
        this.flip = 'inactive';
        this.card = this.studyService.getCurrentCard();
      }
    });

    this.flipToFrontSubscription = rxmq.channel(MessageConstants.STUDY_CHANNEL)
      .observe(MessageConstants.STUDY_FLIP_TO_FRONT_ACTION)
      .subscribe(() => { this.flipToFront(); });

    this.flipToBackSubscription = rxmq.channel(MessageConstants.STUDY_CHANNEL)
      .observe(MessageConstants.STUDY_FLIP_TO_BACK_ACTION)
      .subscribe(() => { this.flipToBack(); });

    this.rightWrongSubscription = rxmq.channel(MessageConstants.RIGHT_WRONG_CHANNEL)
      .observe(MessageConstants.RIGHT_ACTION)
      .subscribe(() => { this.countRightWrongStats(MessageConstants.RIGHT_ACTION); });

    this.rightWrongSubscription = rxmq.channel(MessageConstants.RIGHT_WRONG_CHANNEL)
      .observe(MessageConstants.WRONG_ACTION)
      .subscribe(() => { this.countRightWrongStats(MessageConstants.WRONG_ACTION); });
  }

  ngOnDestroy() { }

  getCardCategory(): string {
    // return CardUtils.getCardCategoryText(this.card);
    return this.card.title;
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

  getNextCard(): void {
    this.animateToNextCard();
    // this.studyService.goToNextCard();
    this.studyService.getNextCard().subscribe((cardResponse: any) => {
      if (cardResponse) {
        this.card = cardResponse;
      }
    });
  }

  getPreviousCard(): void {
    this.animateToNextCard();
    this.card = this.studyService.getPreviousCard();
  }

  animateToNextCard(): void {
    this.visibleFront = true;
    if (this.flip === 'active') {
      this.toggleFlip();
    }
  }

  countRightWrongStats(action: string): void {
    if (action === MessageConstants.RIGHT_ACTION) {
      ++ this.studyService.rightCards;
    }
    // ++ this.studyService.totalCardsStudied;
  }
}
