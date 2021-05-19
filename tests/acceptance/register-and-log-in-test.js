import { module, test } from 'qunit';
import { click, visit, fillIn, waitFor, waitUntil } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | log-in', function (hooks) {
  setupApplicationTest(hooks);

  test('testing registration new user', async function (assert) {
    await visit('/LogIn');

    await click('[data-test-sign-up-button]');

    await fillIn('[data-test-input="name"]', 'Aleksandra');
    await fillIn('[data-test-input="surname"]', 'Olesiak');
    await fillIn('[data-test-input="email"]', 'ola@wp.pl');
    await fillIn('[data-test-input="pswd"]', '12345678');
    await fillIn('[data-test-input="rpswd"]', '12345678');

    await this.pauseTest();
    await click('[data-test-button-save-form]');
    await waitFor('[data-test-log-in]', { timeout: 8000 });
    assert.dom('[data-test-state-text]').containsText('New to IdeaBakers?');
    await waitUntil('[data-test-alert]', { timeout: 6000 });
  });
});
