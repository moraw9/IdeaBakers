import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
export default class NavBarComponent extends Component {
  @service session;

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
      // eslint-disable-next-line no-undef
      this.userName = firebase.auth().currentUser.displayName;
      console.log(this.userName);
      if (this.userName.includes(' ')) {
        const index = this.userName.indexOf(' ');
        this.userName = this.userName.slice(0, index);
      }
    }
  }
}
