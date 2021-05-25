import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | Details', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders information about a details of idea property', async function (assert) {
    this.server.logging = true;

    let serverModel = this.server.create('idea', {
      title: 'Ember Simple Title',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      numberOfKudos: 15,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      userRecordId: '1',
      userUid: 'VmfhNjdWTedYBF4r3Ny0WHNBQxH2',
    });

    this.server.create('user', {
      name: 'Asia',
      surname: 'Jamroz',
      email: 'asai@wp.pl',
      photoUrl: null,
      pswd: '1234578',
      rpswd: '12345678',
      userKudos: 35,
    });

    this.server.create('comment', {
      username: 'Asia',
      date: '1620400637563',
      content: 'Hello everyone!',
      postId: '1',
      userUid: '63Cd6LUgPCe8Kn1UVKCnkVdos9m2',
      userPhoto: null,
    });

    this.server.create('kudo', {
      ideaId: '1',
      date: '1620400637563',
      numberOfVotes: 3,
      userRecordId: 1,
    });

    let store = this.owner.lookup('service:store');
    let model = await store.findRecord('idea', serverModel.id);
    this.set('model', model);
    await render(hbs`<Details @model={{model}} />`);

    assert.dom('.card').exists();
    assert.dom('[data-test-details-kudos]').hasText('15');
    assert.dom('[data-test-details-title]').hasText('Ember Simple Title');
    assert
      .dom('[data-test-details-description]')
      .hasTextContaining(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
      );
    assert.dom('[data-test-details-author]').hasText('Asia');
    assert.dom('[data-test-details-img]').hasAttribute('src');

    let src = document
      .querySelector('[data-test-details-img]')
      .getAttribute('src');
    assert.equal(
      src,
      'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg'
    );

    assert.dom('[data-test-comment-username]').hasTextContaining('Asia');
    assert.dom('[data-test-comment-content]').hasText('Hello everyone!');

    assert.dom('[data-test-vote-urename]').hasTextContaining('Asia');
    assert.dom('[data-test-vote-number-of-votes]').hasTextContaining('3');
  });
});
