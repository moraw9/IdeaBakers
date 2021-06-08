import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';
import fillIn from '@ember/test-helpers/dom/fill-in';
import triggerEvent from '@ember/test-helpers/dom/trigger-event';

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
const fakeFile = new File([''], 'testPhoto.png', {
  type: 'image/png',
  lastModified: 1622146774905,
  name: 'testPhoto',
});

module('Acceptance | edit-user-data', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    this.server.create('user', currentUser);

    await authenticateSession({
      authToken: '12345',
      user: currentUser,
    });
  });

  test('should be forbidden to edit someone data', async function (assert) {
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

    await visit('/profile/2');
    assert.dom('[data-test-user-profile-edit-button]').doesNotExist();
  });

  test('should be possible to edit user data', async function (assert) {
    const firebase = this.owner.lookup('service:firebase');
    firebase.storage().ref = () => {
      return {
        put: () => {},
        getDownloadURL: () =>
          'https://cdn.pixabay.com/photo/2016/12/06/17/11/fushimi-inari-shrine-1886975_1280.jpg',
      };
    };

    await visit('/profile/1');
    assert.dom('[data-test-user-profile-edit-button]').exists();
    await click('[data-test-user-profile-edit-button]');
    await fillIn('[data-test-input=name', 'Olcia');
    await click('[data-test-button-save-form]');
    assert.equal(this.server.db.users[0].name, 'Olcia');

    await click('[data-test-user-profile-edit-button]');
    await fillIn('[data-test-input=name', 'Ola');
    await fillIn('[data-test-input=pswd', 'Bianka1234');
    await fillIn('[data-test-input=rpswd', 'Bianka12');
    await click('[data-test-button-save-form]');
    assert.dom('[data-test-form-validation-text=rpswd]').exists();
    assert
      .dom('[data-test-form-validation-text=rpswd]')
      .hasText(`Repeat password doesn't match password`);
    assert.equal(this.server.db.users[0].name, 'Olcia');
    assert.equal(this.server.db.users[0].pswd, '12345678');
    assert.equal(this.server.db.users[0].rpswd, '12345678');

    await fillIn('[data-test-input=name', '');
    await fillIn('[data-test-input=pswd', 'Bianka1234');
    await fillIn('[data-test-input=rpswd', 'Bianka1234');
    triggerEvent('[data-test-input=file]', 'change', {
      files: [fakeFile],
    });
    await click('[data-test-button-save-form]');

    assert.equal(this.server.db.users[0].name, 'Olcia');
    assert.equal(this.server.db.users[0].pswd, 'Bianka1234');
    assert.equal(this.server.db.users[0].rpswd, 'Bianka1234');

    let src = document
      .querySelector('[data-test-user-profile-photo]')
      .getAttribute('src');
    assert.equal(
      src,
      `https://cdn.pixabay.com/photo/2016/12/06/17/11/fushimi-inari-shrine-1886975_1280.jpg`
    );
  });
});
