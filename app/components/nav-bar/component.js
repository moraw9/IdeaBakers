import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
export default class NavBarComponent extends Component {
  @service session;
  @service firebase;
  @service store;

  @tracked userName;
  @tracked userRecord;

  constructor() {
    super(...arguments);
    this.currentUser = this.firebase.auth().currentUser;
    this.findUserTask.perform();
    this.load();
    this.isActive = true;
  }

  @task({ restartable: true }) *findUserTask() {
    if (this.session.isAuthenticated) {
      const users = yield this.store.findAll('user');
      const [res] = users.filter(
        (user) => user.email === this.currentUser.email
      );
      this.userRecord = res;
    }
  }

  @action
  invalidateSession() {
    this.session.invalidate();
  }

  async load() {
    if (this.session.isAuthenticated) {
      this.userName = this.currentUser.displayName;
      if (this.userName.includes(' ')) {
        const index = this.userName.indexOf(' ');
        this.userName = this.userName.slice(0, index);
      }
    }
  }
}
