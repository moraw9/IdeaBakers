import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class NavBarComponent extends Component {
  @service session;
  @service store;

  @tracked currentUser;

  constructor() {
    super(...arguments);
    if (!this.session.isAuthenticated) {
      return;
    }

    this.currentUser = this.store.findRecord(
      'user',
      this.session.data.authenticated.user.uid
    );
  }

  @action
  invalidateSession() {
    this.session.invalidate();
  }
}
