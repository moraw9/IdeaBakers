import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class CurrentUserService extends Service {
  @service session;
  @service store;

  get currentUser() {
    if (!this.session.isAuthenticated) {
      return null;
    }
    return this.store.findRecord(
      'user',
      this.session.data.authenticated.user.uid
    );
  }
}
