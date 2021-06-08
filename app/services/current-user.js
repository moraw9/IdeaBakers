import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class CurrentUserService extends Service {
  @service session;
  @service store;

  async getCurrentUser() {
    if (!this.session.isAuthenticated) {
      return null;
    }
    const user = await this.store.findRecord(
      'user',
      this.session.data.authenticated.user.uid
    );
    return user;
  }
}
