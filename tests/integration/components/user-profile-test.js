import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | user-profile', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders information about user', async function (assert) {
    let serverModel = this.server.create('user', {
      name: 'Asia',
      surname: 'Jamroz',
      email: 'asia@wp.pl',
      photoUrl: null,
      pswd: '1234578',
      rpswd: '12345678',
      userKudos: 23,
    });

    let store = this.owner.lookup('service:store');
    let model = await store.findRecord('user', serverModel.id);
    this.set('model', model);

    await render(hbs`<UserProfile  @model={{model}} />`);

    assert.dom('.card').exists();
    assert.dom('[data-test-user-profile-kudos]').hasText('23');
    assert.dom('[data-test-user-profile-name]').hasText('Asia');
    assert.dom('[data-test-user-profile-surname]').hasText('Jamroz');
    assert.dom('[data-test-user-profile-email]').hasText('asia@wp.pl');
    assert.dom('[data-test-user-profile-photo]').hasNoAttribute('src');
    assert.dom('[data-test-user-profile-edit-button]').doesNotExist();
    assert
      .dom('[data-test-vote-no-kudos-text]')
      .hasText(`There's no any given kudos yet...`);

    assert
      .dom('[data-test-idea-no-added-text]')
      .hasText(`There's no any added idea yet...`);
  });
});
