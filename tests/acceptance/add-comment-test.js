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

module('Acceptance | add-and-remove-comment', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    this.server.create('user', currentUser);

    this.server.create('idea', {
      title: 'First idea',
      description: 'Description for first idea',
      imageUrl: `https://cdn.pixabay.com/photo/2016/12/06/17/11/fushimi-inari-shrine-1886975_1280.jpg`,
      numberOfKudos: 40,
      userId: currentUser.uid,
    });

    await authenticateSession({
      authToken: '12345',
      user: currentUser,
    });
  });

  test('should be possible to add comment', async function (assert) {
    await visit('/ideas/1');

    assert.dom('[data-test-comment-textarea]').exists();
    assert.dom('[data-test-add-comment-button]').exists();
    const disabledProperty = document.getElementById('submitButton').disabled;
    assert.equal(disabledProperty, true);

    await fillIn('[data-test-comment-textarea]', 'First comment!');
    await click('[data-test-add-comment-button]');

    assert.dom('[data-test-comment-box]').exists();
    assert.dom('[data-test-comment-username]').hasTextContaining('Aleksandra');
    assert.dom('[data-test-comment-content]').hasText('First comment!');
    assert.dom('[data-test-info-no-comment-yet]').doesNotExist();
    assert.dom('[data-test-remove-comment-button]').exists();

    await click('[data-test-remove-comment-button]');
    assert.dom('[data-test-comment-box]').doesNotExist();
  });

  test('should be forbidden to remove someone comment', async function (assert) {
    this.server.create('user', {
      name: 'Katarzyna',
      surname: 'Smilek',
      email: 'kasia@wp.pl',
      userKudos: 35,
      photoURL: '',
      pswd: '12345678',
      rpswd: '12345678',
      uid: 2,
    });

    this.server.create('comment', {
      date: 1622146378162,
      content: 'Hi, great idea!',
      postId: '1',
      userId: '2',
    });

    await visit('/');
    await click('[data-test-title]');

    assert.dom('[data-test-comment-box]').exists();
    assert.dom('[data-test-comment-username]').hasTextContaining('Katarzyna');
    assert.dom('[data-test-comment-content]').hasText('Hi, great idea!');
    assert.dom('[data-test-remove-comment-button]').doesNotExist();
  });

  test('should be forbidden to add comment unlogged users', async function (assert) {
    this.server.create('user', {
      name: 'Katarzyna',
      surname: 'Smilek',
      email: 'kasia@wp.pl',
      userKudos: 35,
      photoURL: '',
      pswd: '12345678',
      rpswd: '12345678',
      uid: 2,
    });

    this.server.create('comment', {
      date: 1622146378162,
      content: 'Hi, great idea!',
      postId: '1',
      userId: '2',
    });
    await invalidateSession();

    await visit('/');
    await click('[data-test-title]');

    assert.dom('[data-test-comment-textarea]').doesNotExist();
    assert.dom('[data-test-add-comment-button]').doesNotExist();

    assert.dom('[data-test-comment-box]').exists();
    assert.dom('[data-test-comment-username]').hasTextContaining('Katarzyna');
    assert.dom('[data-test-comment-content]').hasText('Hi, great idea!');
    assert.dom('[data-test-remove-comment-button]').doesNotExist();
  });
});
