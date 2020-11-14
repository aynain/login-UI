import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {HttpClient, json} from 'aurelia-fetch-client';
import {ValidationControllerFactory, ValidationRules} from 'aurelia-validation';

@inject(ValidationControllerFactory, Router)
export class ResetPassword {
    public resetToken;
    public resetPasswordController;
    public router;
    public resetPasswordForm;
    public newPassword;
    public confirmPassword;
    public passwordMismatchError;
    public passwordSuccessMessage;
    public tokenErrorMessage;

    constructor(controllerFactory, router) {
        this.resetPasswordController = controllerFactory.createForCurrentScope();
        this.router = router;
        this.resetFormValidation();
    }

    activate(params) {
        this.resetToken = params.email;
        this.checkToken(this.resetToken)
    }

    checkToken(resetToken) {
        let client = new HttpClient();
        client.fetch('http://www.mediavase.com/api/check-token/' + resetToken)
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    this.resetPasswordForm = true;
                } else {
                    this.tokenErrorMessage = true;
                }
            });
    }

    public updatePassword() {
        this.resetPasswordController.validate()
            .then(result => {
                if (result.valid && this.checkPassword()) {
                    var data = {
                        token: this.resetToken,
                        password: this.newPassword,
                        connpassword: this.confirmPassword
                    };
                    let client = new HttpClient();
                    client.fetch('http://www.mediavase.com/api/reset-password', {
                        method: "post",
                        body: json(data)
                    }).then(response => response.json())
                        .then(result => {
                            if (result.status) {
                                this.passwordSuccessMessage = true;
                                this.resetPasswordForm = false;
                            }
                        });
                }
            });
    }

    checkPassword() {
        if (this.newPassword == this.confirmPassword) {
            this.passwordMismatchError = false;
            return true;
        } else {
            this.passwordMismatchError = true;
            return false;
        }
    }

    public resetFormValidation() {
        ValidationRules
            .ensure('newPassword')
            .required().withMessage('Password is required')
            .minLength(8).withMessage('Password must contains atleast 8 characters')
            .ensure('confirmPassword').required().withMessage('Confirm Password is required')
            .minLength(8).withMessage('Password must contains atleast 8 characters')
            .on(this);
    }

    loginPage() {
        this.router.navigate('');
    }
}


