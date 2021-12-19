import { DekkMetadata } from "../models/dekk-metadata";

export class DekkUtils {
    public static getEmptyDekkMetadata(): DekkMetadata {
        return {
            dekk_id: '',
            dekk_name: '',
            cards: []
        };
    }
}