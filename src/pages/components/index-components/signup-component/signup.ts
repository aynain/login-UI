import {Router} from 'aurelia-router';
import {NewInstance, Aurelia, inject} from 'aurelia-framework';
import {ValidationController, ValidationRules} from 'aurelia-validation';
import {Index} from "pages/auth/index";
import {Api} from "shared/api";
import {PLATFORM} from 'aurelia-pal';

@inject(NewInstance.of(ValidationController), Aurelia, Router, Index, Api)

export class Signup {
  public signupController;
  public userName;
  public userEmail;
  public successRegisteredMessage;
  public errorRegisteredMessage;
  public router;
  public aurelia;
  public indexClass;
  public api;

  constructor(signupController, aurelia, router, Index, Api) {
    this.signupController = signupController;
    this.router = router;
    this.aurelia = aurelia;
    this.signupValidation();
    this.indexClass = Index;
    this.api = Api;
  }

  toggleLoginPage() {
    this.indexClass.toggleViews(0);
  }

  userSignup() {
    this.signupController.validate()
      .then(result => {
        if (result.valid) {
          var data = {name: this.userName, email: this.userEmail};
          this.api.postData('http://www.mediavase.com/api/signup', data)
            .then(result => result.text())
            .then(jsonData => {
              var result = {status: false, token: '', id: ''};
              result = JSON.parse(atob(jsonData));
              if (result.status) {
                this.successRegisteredMessage = true;
                this.errorRegisteredMessage = false;
                document.cookie = "token=" + result.token;
                document.cookie = "id=" + result.id;
                this.router.navigate('home', {replace: true, trigger: false});
                this.aurelia.setRoot(PLATFORM.moduleName('pages/dashboard/dashboard'))
              } else {
                this.errorRegisteredMessage = true;
                this.successRegisteredMessage = false;
              }
            })
        }
      });
  }

  signupValidation() {
    const SignupRules = ValidationRules
      .ensure("userName")
      .required().withMessage("Name is required")
      .matches(/^[A-Za-z ]+$/)
      .withMessage('Name should contain only alphabets')
      .minLength(3)
      .withMessage('Name must be greater than 3 characters')
      .maxLength(25)
      .withMessage('Name must be less than 25 characters')
      .ensure("userEmail")
      .required().withMessage("Email is required")
      .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      .withMessage('Invalid email format')
      // .ensure("userPassword")
      // .required().withMessage("Password is required")
      // .minLength(8)
      // .withMessage('Password must not less than 8 characters')
      .rules;
    this.signupController.addObject(this, SignupRules);
  }
}
