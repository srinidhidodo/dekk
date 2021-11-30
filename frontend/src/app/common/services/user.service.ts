import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    accessToken: string = '';
    loggedIn: boolean = true;

    loginSuccessful(accessToken: string): void {
        this.accessToken = accessToken;
        this.loggedIn = true;
    }
}