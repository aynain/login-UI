import {inject} from 'aurelia-framework';
import {Api} from "shared/api";

@inject(Api)

export class ForgetPassword {
  public forgetEmail;
  public successEmailSentMessage;
  public errorEmailSentMessage;
  public api;

  constructor(Api) {
    this.api = Api;
  }

  sendLink() {
    var data = {email: this.forgetEmail};
    this.api.postData('http://www.mediavase.com/api/forget-password', data)
      .then(result => result.json())
      .then(jsonData => {
        if (jsonData.status) {
          console.log(jsonData.status);
          this.successEmailSentMessage = true;
          this.errorEmailSentMessage = false;
        } else {
          this.errorEmailSentMessage = true;
          this.successEmailSentMessage = false;
        }
      });
  }
}
