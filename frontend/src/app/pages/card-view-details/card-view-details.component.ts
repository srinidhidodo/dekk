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
  card: Card = {
    card_id: 109,
    account_id: 1,
    title: "Fever",
    category: "General",
    sub_category: "Also General",
    dekk_name: "General Dekk",
    highlighted_keywords: [ "fever", "about fever" ],
    tags: {
      "amoeba": 4,
      "protozoa": 5,
      "free-living": 3
  },
    content_on_front: "something in the front fever something in the front about fever something in the front something in the front something in the front",
    content_on_back: "something in the back fever something in the back about fever something in the back something in the back something in the back"
  };

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() { }

  getCardCategory(): string {
    return CardUtils.getCardCategoryText(this.card);
  }
}
