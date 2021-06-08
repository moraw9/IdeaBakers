import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import {
  authenticateSession,
  invalidateSession,
} from 'ember-simple-auth/test-support';
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
  userKudos: 2,
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
      imageUrl: `https://cdn.pixabay.com/photo/2016/12/06/17/11/fushimi-inari-shrine-1886975_1280.jpg`,
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

  test('it should be possible to vote more than once and block after five given kudos', async function (assert) {
    await visit('/');
    await click('[data-test-title]');

    assert.dom('[data-test-info-no-votes-yet ]').exists();
    assert.dom('[data-test-open-vote-form-button]').exists();
    await click('[data-test-open-vote-form-button]');
    await fillIn('[data-test-number-of-votes-input ]', 2);
    await click('[data-test-add-vote]');
    assert.equal(this.server.db.users[0].userKudos, 33);
    assert.dom('[data-test-info-no-votes-yet ]').doesNotExist();

    await click('[data-test-user-button]');
    assert.dom('[data-test-user-profile-kudos]').hasText('33');
    await visit('/ideas/1');

    await click('[data-test-open-vote-form-button]');
    await fillIn('[data-test-number-of-votes-input ]', 3);
    await click('[data-test-add-vote]');
    const disabledProperty = document.getElementById('addVoteButton').disabled;
    assert.equal(disabledProperty, true);
    assert.equal(this.server.db.users[0].userKudos, 30);

    await click('[data-test-user-button]');
    assert.dom('[data-test-user-profile-kudos]').hasText('30');
  });

  test('it should be forbidden to vote if user doesn`t have kudos', async function (assert) {
    await invalidateSession();
    await authenticateSession({
      authToken: '12345',
      user: otherUser,
    });

    this.server.create('idea', {
      title: 'Second idea',
      description: 'Description for first idea',
      imageUrl: `https://cdn.pixabay.com/photo/2016/12/06/17/11/fushimi-inari-shrine-1886975_1280.jpg`,
      numberOfKudos: 40,
      userId: '1',
    });

    await visit('/ideas/2');
    await click('[data-test-open-vote-form-button]');
    await fillIn('[data-test-number-of-votes-input ]', 5);
    await click('[data-test-add-vote]');
    assert.equal(this.server.db.users[1].userKudos, 2);
    assert.dom('[data-test-info-no-votes-yet ]').exists();

    await fillIn('[data-test-number-of-votes-input ]', 2);
    await click('[data-test-add-vote]');
    assert.equal(this.server.db.users[1].userKudos, 0);
    assert.dom('[data-test-info-no-votes-yet ]').doesNotExist();

    const disabledProperty = document.getElementById('addVoteButton').disabled;
    assert.equal(disabledProperty, true);
  });
});
