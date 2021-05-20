import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | idea', function (hooks) {
  setupRenderingTest(hooks);
  test('it renders information about a idea property', async function (assert) {
    this.setProperties({
      idea: {
        title: 'Simple Title',
        description: 'Lorem ipsum dolor',
        numberOfKudos: 15,
        imageURL:
          'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        userRecordID: 'aOeEiqbwXig2PCgCBEtz',
        userUID: 'VmfhNjdWTedYBF4r3Ny0WHNBQxH2',
      },
    });
    await render(hbs`<Idea @idea={{this.idea}} />`);
    assert.dom('.card').exists();
    assert.dom('[data-test-title]').hasText('Simple Title');
    assert.dom('[data-test-description]').hasText('Lorem ipsum dolor...');
    // await this.pauseTest();
    // assert.dom('[data-test-author]').hasText('Admin');
    assert.dom('[data-test-img]').hasAttribute('style');

    let style = document.querySelector('[data-test-img]').getAttribute('style');
    assert.equal(
      style,
      `background-image: url(https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg);`
    );
  });
});
