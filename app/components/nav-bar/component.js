import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
export default class NavBarComponent extends Component {
  @service session;

  constructor() {
    super(...arguments);
    this.load();
  }

  @action
  invalidateSession() {
    this.session.invalidate();
  }

  async load() {
    // eslint-disable-next-line no-undef
    this.userName = firebase.auth().currentUser.displayName;
  }
}
