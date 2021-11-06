import { Dekk } from "./dekk";
import { User } from "./user";

export interface HomeResponse {
    user_details: User;
    dekk_stats: Dekk[];
}