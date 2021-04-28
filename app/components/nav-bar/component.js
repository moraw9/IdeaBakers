import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class NavBarComponent extends Component {
  @service session;
  @tracked userName;

  constructor() {
    super(...arguments);
    this.load();
    this.isActive = true;
  }

  @action
  invalidateSession() {
    this.session.invalidate();
  }

  async load() {
    if (this.session.isAuthenticated) {
      this.userName = this.args.userName
        ? this.args.userName
        : firebase.auth().currentUser.displayName;
      if (this.userName.includes(' ')) {
        const index = this.userName.indexOf(' ');
        this.userName = this.userName.slice(0, index);
      }
    }
  }
}
