import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | idea', function (hooks) {
  setupRenderingTest(hooks);


  test('it renders information about a idea property', async function (assert) {
    this.setProperties({
      idea: {
        title: 'Simple Title',
        user: 'Veruca Salt',
        description: 'Lorem ipsum dolor',
        numberOfKudos: 15,
        imageURL: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      },
    });

    await render(hbs `<Idea @idea={{this.idea}} />`);
 
    assert.dom('.card').exists();
    assert.dom('.card .idea-author i').hasText('Veruca Salt');
    assert.dom('.card .idea-title h1').hasText('Simple Title');
    assert.dom('.card .idea-short-description').hasText('Lorem ipsum dolor');
    assert.dom('.card .idea-img').hasAttribute('style');

    let style = document.querySelector('.idea-img').getAttribute('style');
    assert.equal(style, `background-image: url(https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg);` );
  });
    
});