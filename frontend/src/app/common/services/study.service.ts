import { Injectable } from "@angular/core";
import { Card } from "../models/card";

@Injectable({
    providedIn: 'root',
})
export class StudyService {
    private _card: Card = {
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

    public get card(): Card {
        return this._card;
    }

    public set card(card: Card) {
        this._card = card;
    }
}