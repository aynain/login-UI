import {Router} from 'aurelia-router';
import {NewInstance, Aurelia, inject} from 'aurelia-framework';
import {PLATFORM} from 'aurelia-pal';
import {ValidationController, ValidationRules} from 'aurelia-validation';
import {Index} from "pages/auth/index";
import {Api} from "shared/api";

@inject(NewInstance.of(ValidationController), Aurelia, Router, Index, Api)

export class Login {
  public loginController;
  public loginEmail;
  public loginPassword;
  public incorrectCredentials;
  public router;
  public aurelia;
  public indexClass;
  public api;

  constructor(loginController, aurelia, router, Index, Api) {
    this.loginController = loginController;
    this.router = router;
    this.aurelia = aurelia;
    this.loginValidation();
    this.indexClass = Index;
    this.api = Api;
  }

  toggleForgetPassword() {
    this.indexClass.toggleViews(2);
  }

  userLogin() {
    this.loginController.validate()
      .then(result => {
        if (result.valid) {
          var data = {email: this.loginEmail, password: this.loginPassword,};
          this.api.postData('http://www.mediavase.com/api/login', data)
            .then(res => res.text())
            .then(jsonData => {
              var result = {status: false, token: '', id: ''};
              result = JSON.parse((atob(jsonData)));
              if (result.status) {
                document.cookie = "token=" + result.token;
                document.cookie = "id=" + result.id;
                this.router.navigate('home', {replace: true, trigger: false});
                this.aurelia.setRoot(PLATFORM.moduleName('pages/dashboard/dashboard'))
              } else {
                this.incorrectCredentials = true;
                this.loginPassword = '';
              }
            })
        }
      });
  }

  loginValidation() {
    const LoginRules = ValidationRules
      .ensure("loginEmail")
      .required().withMessage("Email is required")
      .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      .withMessage('Invalid email format')
      .ensure("loginPassword")
      .required().withMessage("Password is required")
      .rules;
    this.loginController.addObject(this, LoginRules);
  }
}
