import {Aurelia, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {PLATFORM} from 'aurelia-pal';
import {Api} from "shared/api";

@inject(Router, Aurelia, Api)
export class SharedClass {
  public router;
  public aurelia;
  public api;

  constructor(router, aurelia, Api) {
    this.router = router;
    this.aurelia = aurelia;
    this.api = Api;
  }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  signout() {
    var token_cokie = this.getCookie('id');
    var data = {
      user_id: token_cokie
    };
    this.api.postData('http://taskboard.com/api/logout', data)
      .then(result => result.text())
      .then(jsonData =>  {
        document.cookie = 'token' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'id' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        this.router.navigate('', {replace: true, trigger: false});
         this.aurelia.setRoot(PLATFORM.moduleName('app'))
      })
  }
}
