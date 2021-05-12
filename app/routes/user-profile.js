import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class UserRoute extends Route {
  @service can;

  beforeModel(transition) {
    let result = super.beforeModel(...arguments);

    if (this.can.cannot('view profile for user')) {
      transition.abort();
      return this.transitionTo('log-in');
    }

    return result;
  }
}
