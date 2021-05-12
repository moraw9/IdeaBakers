import JSONAPIAdapter from '@ember-data/adapter/json-api';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class LogInAdapter extends JSONAPIAdapter {
  @service session;

  @computed(
    // eslint-disable-next-line ember/use-brace-expansion
    'session.data.authenticated.access_token',
    'session.isAuthenticated'
  )
  get headers() {
    let headers = {};
    if (this.session.isAuthenticated) {
      // OAuth 2
      headers[
        'Authorization'
      ] = `Bearer ${this.session.data.authenticated.access_token}`;
    }

    return headers;
  }
}
