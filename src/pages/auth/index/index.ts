import {Router} from 'aurelia-router';
import {Aurelia, inject} from 'aurelia-framework';
import {PLATFORM} from 'aurelia-pal';
import {SharedClass} from 'shared/shared';

@inject(Aurelia, Router, SharedClass)

export class Index {
    public signUp;
    public signIn = true;
    public forgetPassword;
    public router;
    public aurelia;
    public shared;
    public type;

    constructor(aurelia, router, sharedInstance) {
        this.router = router;
        this.aurelia = aurelia;
        this.shared = sharedInstance;
        this.shared.getCookie();
    }

    attached() {
        this.userCookieExists();
    }

    toggleViews(type) {
        if (type === 0) {
            this.signUp = false;
            this.signIn = true;
            this.forgetPassword = false;
        } else if (type === 1) {
            this.signUp = true;
            this.signIn = false;
            this.forgetPassword = false;
        } else if (type === 2) {
            this.forgetPassword = true;
            this.signUp = false;
            this.signIn = false;
        }
    }

    userCookieExists() {
        var tokenCookie = this.shared.getCookie('token');
        var emailCookie = this.shared.getCookie('id');
        if (tokenCookie && emailCookie) {
            this.aurelia.setRoot(PLATFORM.moduleName('pages/dashboard/dashboard'))
        } else {
            document.cookie = 'token' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'id' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }
}
