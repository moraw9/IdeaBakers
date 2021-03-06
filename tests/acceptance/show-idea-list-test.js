import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import {
  authenticateSession,
  invalidateSession,
} from 'ember-simple-auth/test-support';
import { currentURL } from '@ember/test-helpers/setup-application-context';

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

module('Acceptance | show-ideas', function (hooks) {
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

    this.server.create('idea', {
      title: 'Second idea',
      description: 'Description for second idea',
      imageUrl: `https://cdn.pixabay.com/photo/2016/12/06/17/11/fushimi-inari-shrine-1886975_1280.jpg`,
      numberOfKudos: 40,
      userId: currentUser.uid,
    });

    await authenticateSession({
      authToken: '12345',
      user: currentUser,
    });
  });

  test('should display two ideas', async function (assert) {
    await visit('/');
    assert.dom('[data-test-idea]').exists({ count: 2 });
  });

  test('shouldn`t access to user profile route', async function (assert) {
    await invalidateSession();
    await visit('/');
    await visit('/profile/1');
    assert.equal(currentURL(), '/LogIn');
  });
});
