import { Card } from "../models/card";

export class CardUtils {
    public static getCardCategoryText(card: Card): string {
        return card?.category + (card?.sub_category ? ' / ' + card?.sub_category : '');
    }

    public static getCardDekkText(card: Card): string {
        return this.getCardCategoryText(card) + ' / ' + card.dekk_name;
    }
}