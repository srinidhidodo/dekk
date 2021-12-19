import { CardMetadata } from "./card-metadata";

export interface DekkMetadata {
    dekk_name: string;
    dekk_id: string;
    cards: CardMetadata[];
}