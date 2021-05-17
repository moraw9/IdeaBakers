import EmberRouter from '@ember/routing/router';
import config from 'idea-bakers/config/environment';
export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}
Router.map(function () {
  this.route('index', { path: '/' });
  this.route('idea-details', { path: '/ideas/:id' });
  this.route('log-in', { path: '/LogIn' });
  this.route('user-profile', { path: '/profile/:user_id' });
});
