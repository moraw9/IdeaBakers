import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class NavBarComponent extends Component {
  @service session;
  @service store;
  @service('current-user') user;

  @tracked currentUser;

  constructor() {
    super(...arguments);
    if (!this.session.isAuthenticated) {
      return;
    }

    this.currentUser = this.user.currentUser;
  }

  @action
  invalidateSession() {
    this.session.invalidate();
  }
}
