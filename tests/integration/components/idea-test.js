import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | idea', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders information about a idea property', async function (assert) {
    this.idea = this.server.create('idea', {
      title: 'Ember Simple Title',
      description: 'Lorem ipsum dolor',
      numberOfKudos: 15,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      userRecordId: 'aOeEiqbwXig2PCgCBEtz',
      userUid: 'VmfhNjdWTedYBF4r3Ny0WHNBQxH2',
    });

    await render(hbs`<Idea @idea={{this.idea}} />`);

    assert.dom('.card').exists();
    assert.dom('[data-test-title]').hasText('Ember Simple Title');
    assert.dom('[data-test-description]').hasText('Lorem ipsum dolor...');
    // assert.dom('[data-test-author]').hasText('Admin');
    assert.dom('[data-test-img]').hasAttribute('style');

    let style = document.querySelector('[data-test-img]').getAttribute('style');
    assert.equal(
      style,
      `background-image: url(https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg);`
    );
  });
});
