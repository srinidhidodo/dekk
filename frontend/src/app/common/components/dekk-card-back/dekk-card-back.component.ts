import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageConstants } from 'app/common/constants/message.constants';
import { Subject } from 'rxjs';
import rxmq from 'rxmq';

@Component({
  selector: 'dekk-card-back',
  templateUrl: './dekk-card-back.component.html',
  styleUrls: ['./dekk-card-back.component.scss'],
})
export class DekkCardBackComponent implements OnInit, OnDestroy {

  @Input()
  dekkCategory = '';

  @Input()
  cardContent = '';

  flipToFrontObservable: Subject<any>;

  constructor() {
    this.flipToFrontObservable = rxmq.channel(MessageConstants.STUDY_CHANNEL)
      .subject(MessageConstants.STUDY_FLIP_TO_FRONT_ACTION);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    // this.flipToFrontObservable.unsubscribe();
  }

  flipToFront(): void {
    this.flipToFrontObservable.next({
      title: 'flipToFront',
      text: 'Flip to front'
    });
  }

}
