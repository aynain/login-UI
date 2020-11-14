import {PLATFORM} from 'aurelia-pal';
import {RouterConfiguration, Router} from 'aurelia-router';

export class App {
    router: Router;
    configureRouter(config: RouterConfiguration, router: Router): void {
        this.router = router;
        config.title = 'Mediavase';
        config.mapUnknownRoutes(PLATFORM.moduleName('pages/auth/index/index'));
        config.map([
            {route: '', name: 'index', moduleId: PLATFORM.moduleName('pages/auth/index/index'), nav: true},
            { route: ['password-reset/:email'],  name: 'password-reset', moduleId: PLATFORM.moduleName('pages/auth/password-reset/password-reset'), title: 'Reset Password'},
            { route: ['password-set/:email'],  name: 'set-password', moduleId: PLATFORM.moduleName('pages/auth/set-password/set-password'), title: 'Set Password'}
          ]);
    }
}

