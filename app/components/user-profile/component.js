import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
export default class UserProfileComponent extends Component {
  @service session;
  @service currentUser;

  constructor() {
    super(...arguments);
    this.load();
  }
  async load() {
    // eslint-disable-next-line no-undef
    this.user = firebase.auth().currentUser;
    console.log(this.user);
  }
}
