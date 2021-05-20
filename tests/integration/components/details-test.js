import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | Details', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders information about a details of idea property', async function (assert) {
    let serverModel = this.server.create('idea', {
      title: 'Ember Simple Title',
      description: 'Lorem ipsum dolor',
      numberOfKudos: 15,
      imageURL:
        'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      userRecordID: 'aOeEiqbwXig2PCgCBEtz',
      userUID: 'VmfhNjdWTedYBF4r3Ny0WHNBQxH2',
    });
    console.log('serverModel', serverModel);

    let store = this.owner.lookup('service:store');
    let ideas = await store.findAll('idea');
    console.log('all ideas', ideas);
    let model = await store.findRecord('idea', serverModel.id);
    console.log('model', model);
    await this.pauseTest();
    this.set('model', model);

    await render(hbs`<Details @model={{model}} />`);

    await this.pauseTest();
    assert.dom('.card').exists();
    assert.dom('[data-test-details-kudos]').hasText('43');
    assert.dom('[data-test-details-title]').hasText('Lotos Camp');
    assert
      .dom('[data-test-details-description]')
      .hasTextContaining(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
      );
    // await this.pauseTest();
    // assert.dom('[data-test-author]').hasText('Admin');
    assert.dom('[data-test-details-img]').hasAttribute('src');

    let src = document
      .querySelector('[data-test-details-img]')
      .getAttribute('src');
    assert.equal(
      src,
      `https://firebasestorage.googleapis.com/v0/b/ideabakers-c756c.appspot.com/o/project%2FIMG-1042.jpg%2F1620041822498?alt=media&token=dc872de7-906f-4dbe-8654-eb43af2e0942`
    );
  });
});
