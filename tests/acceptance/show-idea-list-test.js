import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import {
  authenticateSession,
  invalidateSession,
} from 'ember-simple-auth/test-support';

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
      imageUrl: `https://loremflickr.com/cache/resized/65535_50323736618_46ca9bf94f_z_360_360_nofilter.jpg`,
      numberOfKudos: 40,
      userId: currentUser.id,
    });

    this.server.create('idea', {
      title: 'Second idea',
      description: 'Description for second idea',
      imageUrl: `https://loremflickr.com/cache/resized/65535_50745657987_4c85192fa9_360_360_nofilter.jpg`,
      numberOfKudos: 40,
      userId: currentUser.id,
    });

    await authenticateSession({
      authToken: '12345',
      user: currentUser,
    });
  });

  test('should display two ideas', async function (assert) {
    await visit('/');

    await this.pauseTest();

    assert.dom('[data-test-idea]').exists({ count: 2 });
  });

  test('shouldn`t access to xxx route', async function (assert) {
    await invalidateSession();
    await visit('/');
  });
});
