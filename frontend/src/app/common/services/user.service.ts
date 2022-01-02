import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    accessToken: string = '';
    loggedIn: boolean = false;
    EXPIRY_IN_MS: number = 86400000;

    initializeWithPreviousLogin(): void {
        if (localStorage['accessToken'] && !!(localStorage['expiry']) && localStorage['expiry'] > new Date().getTime()) {
            this.loggedIn = true;
            this.accessToken = localStorage['accessToken'];
        } else {
            this.logout();
        }
    }

    loginSuccessful(accessToken: string): void {
        this.accessToken = accessToken;
        localStorage['accessToken'] = accessToken;
        localStorage['expiry'] = new Date().getTime() + this.EXPIRY_IN_MS;
        this.loggedIn = true;
    }

    logout(): void {
        this.accessToken = '';
        this.loggedIn = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('expiry');
    }
}