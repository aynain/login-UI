import {Aurelia} from 'aurelia-framework'
import {inject} from 'aurelia-dependency-injection';
import {ValidationControllerFactory, ValidationRules} from 'aurelia-validation';
import {Router} from 'aurelia-router';
import {Api} from "shared/api";

@inject(Aurelia, ValidationControllerFactory, Router, Api)
export class SetPassword {
  public passwordValidationController;
  public password;
  public confirmPassword;
  public email;
  public token;
  public router;
  public aurelia;
  public api;

  constructor(aurelia, controllerFactory, Router, Api) {
    this.aurelia = aurelia;
    this.passwordValidationController = controllerFactory.createForCurrentScope();
    this.runPasswordValidation();
    this.router = Router;
    this.api = Api;
  }

  activate(params) {
    this.token = params.email;
    console.log(this.token);
  }

  runPasswordValidation() {
    const PasswordRules = ValidationRules
      .ensure("password")
      .required().withMessage("Password is required")
      .minLength(8)
      .withMessage('Password must not less than 8 characters')
      .ensure("confirmPassword")
      .required().withMessage("Confirm password is required")
      .minLength(8)
      .withMessage('Password must not less than 8 characters')
      .rules;
    this.passwordValidationController.addObject(this, PasswordRules);
  }

  savePassword() {
    this.passwordValidationController.validate()
      .then(result => {
        if (result.valid) {
          var data = {token: this.token};
          this.api.postData('http://www.mediavase.com/api/get-email-against-token', data)
            .then(result => result.json())
            .then(jsonData => {
              if (jsonData.status) {
                this.email = jsonData.email;
                var data = {email: this.email, password: this.password, type: 'passwordupdate'};
                this.api.updateData('http://www.mediavase.com/api/signup/', this.email, data)
                  .then(result => result.json())
                  .then(jsonData => {
                    this.router.navigate('');
                  });
              }
            });
        }
      });
  }

}
