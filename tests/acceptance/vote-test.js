import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import {
  authenticateSession,
  invalidateSession,
} from 'ember-simple-auth/test-support';
import { currentURL } from '@ember/test-helpers/setup-application-context';
import fillIn from '@ember/test-helpers/dom/fill-in';

const currentUser = {
  name: 'Aleksandra',
  surname: 'Olesiak',
  email: 'ola@wp.pl',
  userKudos: 35,
  photoURL: '',
  pswd: '12345678',
  rpswd: '12345678',
  uid: 1,
};
const otherUser = {
  name: 'Katarzyna',
  surname: 'Smilek',
  email: 'kasia@wp.pl',
  userKudos: 35,
  photoURL: '',
  pswd: '12345678',
  rpswd: '12345678',
  uid: 2,
};

module('Acceptance | vote', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    this.current = this.server.create('user', currentUser);
    this.server.create('user', otherUser);

    this.server.create('idea', {
      title: 'First idea',
      description: 'Description for first idea',
      imageUrl: `https://loremflickr.com/cache/resized/65535_50323736618_46ca9bf94f_z_360_360_nofilter.jpg`,
      numberOfKudos: 40,
      userId: '2',
    });

    await authenticateSession({
      authToken: '12345',
      user: currentUser,
    });
  });

  test('should be forbbiden to vote unlogged users', async function (assert) {
    await invalidateSession();
    await visit('/');
    await click('[data-test-title]');
    assert.dom('[data-test-open-vote-form-button]').doesNotExist();
  });

  test('it should be possible to vote more than once', async function (assert) {
    await visit('/');
    await click('[data-test-title]');

    assert.dom('[data-test-info-no-votes-yet ]').exists();
    assert.dom('[data-test-open-vote-form-button]').exists();
    await click('[data-test-open-vote-form-button]');
    await fillIn('[data-test-number-of-votes-input ]', 2);
    await click('[data-test-add-vote]');
    assert.dom('[data-test-info-no-votes-yet ]').doesNotExist();

    await click('[data-test-user-button]');
    assert.dom('[data-test-user-profile-kudos]').hasText('33');
    await visit('/ideas/1');

    await click('[data-test-open-vote-form-button]');
    await fillIn('[data-test-number-of-votes-input ]', 3);
    await click('[data-test-add-vote]');

    await click('[data-test-user-button]');
    assert.dom('[data-test-user-profile-kudos]').hasText('30');

    // await visit('/ideas/1');
    // await this.pauseTest();
    // const disabledProperty = document.getElementById('addVoteButton').disabled;
    // assert.equal(disabledProperty, true);
  });
});
