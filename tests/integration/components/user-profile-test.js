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

    this.server.create('idea', {
      title: 'Second idea',
      description: 'Description for second idea',
      imageUrl: `https://cdn.pixabay.com/photo/2016/12/06/17/11/fushimi-inari-shrine-1886975_1280.jpg`,
      numberOfKudos: 40,
      userId: '1',
    });
    this.server.create('kudo', {
      date: 1622146378162,
      ideaId: '1',
      userId: '1',
      numberOfVotes: 5,
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
    assert.dom('[data-test-single-vote-in-list]').exists();
    assert.dom('[data-test-single-vote-number-of-kudos]').hasText('5');
    assert.dom('[data-test-single-added-idea-in-list]').exists();
    assert.dom('[data-test-single-added-idea-title]').hasText('Second idea');
  });
});
