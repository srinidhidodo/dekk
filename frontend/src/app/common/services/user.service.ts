import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    accessToken: string = '';
    loggedIn: boolean = false;

    initializeWithPreviousLogin(): void {
        if (localStorage['accessToken']) {
            this.loggedIn = true;
            this.accessToken = localStorage['accessToken'];
        }
    }

    loginSuccessful(accessToken: string): void {
        this.accessToken = accessToken;
        localStorage['accessToken'] = accessToken;
        this.loggedIn = true;
    }

    logout(): void {
        this.accessToken = '';
        this.loggedIn = false;
        localStorage.removeItem('accessToken');
    }
}