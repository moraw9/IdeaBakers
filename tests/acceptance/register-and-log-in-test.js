import { module, test } from 'qunit';
import { click, visit, fillIn, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import CloudFirestoreAdapter from 'ember-cloud-firestore-adapter/adapters/cloud-firestore';
import CloudFirestoreSerializer from 'ember-cloud-firestore-adapter/serializers/cloud-firestore';

class FirestoreAdapter extends CloudFirestoreAdapter {}
class FirestoreSerializer extends CloudFirestoreSerializer {}

module('Acceptance | log-in', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('adapter:application', FirestoreAdapter);
    this.owner.register('serializer:application', FirestoreSerializer);
  });

  test('testing registration and log in new user', async function (assert) {
    const store = this.owner.lookup('service:store');
    await visit('/LogIn');
    await click('[data-test-sign-up-button]');

    await fillIn('[data-test-input="name"]', 'Aleksandra');
    await fillIn('[data-test-input="surname"]', 'Olesiak');
    await fillIn('[data-test-input="email"]', 'ola8@wp.pl');
    await fillIn('[data-test-input="pswd"]', '12345678');
    await fillIn('[data-test-input="rpswd"]', '12345678');

    await click('[data-test-button-save-form]');
    await waitFor('[data-test-log-in-button]', { timeout: 3000 });
    assert.dom('[data-test-state-text]').containsText('New to IdeaBakers?');

    await fillIn('[data-test-login]', 'ola8@wp.pl');
    await fillIn('[data-test-password]', '12345678');

    await click('[data-test-log-in-button]');
    await waitFor('[data-test-user-button]', { timeout: 2000 });

    assert.dom('[data-test-user-button]').exists();
    assert.dom('[data-test-name-in-nav]').hasText('Aleksandra');

    const user = firebase.auth().currentUser;
    await store
      .findRecord('user', user.uid, { reload: true })
      .then((currentUser) => {
        return currentUser.destroyRecord();
      });
    await user.delete();

    assert.dom('[data-test-log-out-button]').exists();
    await click('[data-test-log-out-button]', { timeout: 3000 });
    await waitFor('[data-test-link-to-log-in]', { timeout: 5000 });
    assert.dom('[data-test-link-to-log-in]').exists();
  });
});
