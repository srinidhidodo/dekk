import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Card } from "src/app/common/models/card";
import { CardUtils } from "src/app/common/utils/card.utils";

@Component({
  selector: 'app-card-view-details',
  styleUrls: ['./card-view-details.component.scss'],
  templateUrl: './card-view-details.component.html'
})
export class CardViewDetailsComponent implements OnInit, OnDestroy {
  
  @Input()
  card: Card;

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() { }

  getCardCategory(): string {
    return CardUtils.getCardCategoryText(this.card);
  }
}
