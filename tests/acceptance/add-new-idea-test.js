import { module, skip, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import {
  authenticateSession,
  invalidateSession,
} from 'ember-simple-auth/test-support';
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

module('Acceptance | add-new-idea', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    this.current = this.server.create('user', currentUser);

    await authenticateSession({
      authToken: '12345',
      user: currentUser,
    });
  });

  test('should be forbbiden to add new idea unlogged users', async function (assert) {
    await invalidateSession();
    await visit('/');
    assert.dom('[data-test-open-modal-for-idea-button]').doesNotExist();
  });

  skip('it should be possible to add project to idea`s list', async function (assert) {
    await visit('/');

    assert.dom('[data-test-open-modal-for-idea-button]').exists();
    await click('[data-test-open-modal-for-idea-button]');
    await click('[data-test-add-idea-button]');

    assert.dom('[data-test-title-validation]').exists();
    assert.dom('[data-test-description-validation]').exists();
    assert.dom('[data-test-img-validation]').exists();
    assert.dom('[data-test-kudos-validation]').exists();

    await fillIn('[data-test-idea-title-input]', 'First idea');
    await fillIn(
      '[data-test-idea-description-textarea]',
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae dignissim magna. Duis aliquet dolor vel metus ornare auctor. Quisque tempor volutpat dictum. Quisque ultrices tempus enim et accumsan. Aenean rhoncus erat justo, vel rutrum metus aliquet a. Ut ornare nec metus ac blandit. Nam et tellus eu felis molestie scelerisque quis sit amet metus. Maecenas efficitur risus ut vulputate fringilla. Curabitur leo augue, ullamcorper eu ligula quis, rutrum sollicitudin enim. Integer quam mauris, interdum ac mi vel, varius maximus lectus. Fusce in tincidunt odio. Etiam efficitur neque lorem, nec scelerisque arcu efficitur nec. Ut pulvinar dignissim finibus. Nam eros elit, egestas sed enim vitae, mattis porta eros. Etiam in mi sem. Phasellus volutpat id erat ut consequat.
        Mauris ut risus ornare, blandit diam sollicitudin, mollis massa. Suspendisse potenti. Quisque non erat eu dui mattis fringilla vel quis tortor. Etiam cursus sapien nec convallis consequat. Integer eget ex vitae lacus suscipit egestas in ut neque. Integer in risus purus. Curabitur non libero id ex semper porta. Nulla vel commodo libero, a pulvinar enim. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec malesuada aliquet urna nec facilisis.`
    );
    await fillIn('[data-test-idea-kudos-input]', 40);
    triggerEvent('[data-test-idea-img-input]', 'change', {
      files: [fakeFile],
    });
    await click('[data-test-add-idea-button]');
    assert.dom('[data-test-idea]').exists({ count: 1 });
  });
});
