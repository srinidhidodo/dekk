import { Card } from "../models/card";
import * as _ from 'lodash';

export class CardUtils {
    static OFFSET_LOAD_MAX_NUM_OF_CARDS = 10;
    
    public static getCardCategoryText(card: Card): string {
        // return card?.category + (card?.sub_category ? ' / ' + card?.sub_category : '');
        let cardCategory = '';
        _.forEach(card.tags, (element: any) => {
            if (element.value === 1)
            cardCategory = element.key + '/';
        });
        cardCategory += card.title;
        return cardCategory;
    }

    public static getCardDekkText(card: Card): string {
        return this.getCardCategoryText(card) + ' / ' + card.dekk_name;
    }

    public static getDummyCard(): Card {
        return {
            card_id: '-1',
            account_id: -1,
            title: "Invalid Card",
            category: "Invalid",
            dekk_name: "Invalid",
            highlighted_keywords: [],
            tags: {},
            content_on_front: "Invalid Card",
            content_on_back: "Invalid Card"
        };
    }

    public static getWaitCard(): Card {
        return {
            card_id: '-1',
            account_id: -1,
            title: "",
            category: "",
            dekk_name: "",
            highlighted_keywords: [],
            tags: {},
            content_on_front: "Please wait",
            content_on_back: "Please wait"
        };
    }
}