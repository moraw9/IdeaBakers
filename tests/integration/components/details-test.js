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

    let store = this.owner.lookup('service:store');
    await this.pauseTest();
    let model = await store.findRecord('idea', serverModel.id);
    console.log('model', model);
    await this.pauseTest();
    this.set('model', model);
    await render(hbs`<Details @model={{model}} />`);
    await this.pauseTest();
    assert.dom('.card').exists();
    assert.dom('[data-test-details-kudos]').hasText('15');
    assert.dom('[data-test-details-title]').hasText('Ember Simple Title');
    assert
      .dom('[data-test-details-description]')
      .hasTextContaining(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
      );
    // await this.pauseTest();
    assert.dom('[data-test-author]').hasText('Asia');
    assert.dom('[data-test-details-img]').hasAttribute('src');

    let src = document
      .querySelector('[data-test-details-img]')
      .getAttribute('src');
    assert.equal(
      src,
      'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg'
    );
  });
});
