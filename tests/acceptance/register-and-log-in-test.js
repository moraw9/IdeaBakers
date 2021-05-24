import { module, test } from 'qunit';
import { click, visit, fillIn, waitFor, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | log-in', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  // test('testing registration new user', async function (assert) {
  //   await visit('/LogIn');
  //   await click('[data-test-sign-up-button]');

  //   await fillIn('[data-test-input="name"]', 'Aleksandra');
  //   await fillIn('[data-test-input="surname"]', 'Olesiak');
  //   await fillIn('[data-test-input="email"]', 'ola8@wp.pl');
  //   await fillIn('[data-test-input="pswd"]', '12345678');
  //   await fillIn('[data-test-input="rpswd"]', '12345678');

  //   await this.pauseTest();
  //   await click('[data-test-button-save-form]');
  //   await waitFor('[data-test-log-in-button]', { timeout: 3000 });
  //   assert.dom('[data-test-state-text]').containsText('New to IdeaBakers?');
  //   await this.pauseTest();
  // });

  test('testing log in and log out', async function (assert) {
    this.server.create('user', {
      name: 'Aleksandra',
      surname: 'Olesiak',
      email: 'ola@wp.pl',
      userKudos: 35,
      photoURL: '',
      pswd: '12345678',
      rpswd: '12345678',
    });
    await visit('/LogIn');

    let store = this.owner.lookup('service:store');
    let users = await store.findAll('user');
    console.log('all users', users);
    await this.pauseTest();

    await fillIn('[data-test-login]', 'ola@wp.pl');
    await fillIn('[data-test-password]', '12345678');

    await click('[data-test-log-in-button]');
    await waitFor('[data-test-user-button]', { timeout: 2000 });

    assert.dom('[data-test-user-button]').exists();
    assert.dom('[data-test-name-in-nav]').hasText('Aleksandra');

    await this.pauseTest();

    // eslint-disable-next-line no-undef
    const currentUser = firebase.auth().currentUser;
    // const store = this.owner.lookup('service:store');
    // const users = await store.findAll('user');
    // const [userRecord] = users.filter(
    //   (user) => user.email === currentUser.email
    // );

    // await userRecord.destroyRecord();
    // await currentUser.delete();

    assert.dom('[data-test-log-out-button]').exists();
    await click('[data-test-log-out-button]', { timeout: 3000 });
    await waitFor('[data-test-link-to-log-in]', { timeout: 5000 });
    assert.dom('[data-test-link-to-log-in]').exists();
  });
});
