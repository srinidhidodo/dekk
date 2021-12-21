import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    // accessToken: string = '';
    // loggedIn: boolean = false;

    accessToken: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX25hbWUiOiJhYmNhYmMiLCJmdWxsX25hbWUiOiJhYmMiLCJpc19hZG1pbiI6IkZhbHNlIiwiYWNjb3VudF9pZCI6MTIsImV4cCI6MTY0MDA4MDIwN30.R6ImuN0pTrDb0sP8CGiNAnKx2lsVHCyuP7yI4xRs5VM';
    loggedIn: boolean = true;

    loginSuccessful(accessToken: string): void {
        this.accessToken = accessToken;
        this.loggedIn = true;
    }
}