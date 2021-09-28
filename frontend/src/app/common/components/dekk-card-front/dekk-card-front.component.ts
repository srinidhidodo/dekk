import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageConstants } from 'app/common/constants/message.constants';
import { Subject } from 'rxjs';
import rxmq from 'rxmq';

@Component({
  selector: 'dekk-card-front',
  templateUrl: './dekk-card-front.component.html',
  styleUrls: ['./dekk-card-front.component.scss'],
})
export class DekkCardFrontComponent implements OnInit, OnDestroy {

  @Input()
  dekkCategory = '';

  @Input()
  cardContent = '';

  flipToBackObservable: Subject<any>;

  constructor() { 
    this.flipToBackObservable = rxmq.channel(MessageConstants.STUDY_CHANNEL)
      .subject(MessageConstants.STUDY_FLIP_TO_BACK_ACTION);
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy() {
    // this.flipToBackObservable.unsubscribe();
  }

  flipToBack(): void {
    this.flipToBackObservable.next({
      title: 'flipToBack',
      text: 'Flip to back'
    });
  }
}
