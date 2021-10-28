export interface Card {
    card_id: number;
    account_id: number;
    created_at?: string;
    updated_at?: string;
    title: string;
    highlighted_keywords: string[];
    tags: {[key: string]: number},
    content_on_front: string;
    content_on_back: string;

    category: string;
    sub_category?: string;
    dekk_name: string;
}