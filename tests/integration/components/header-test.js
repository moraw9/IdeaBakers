import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | headers', function(hooks) {
  setupRenderingTest(hooks);

  test('it render the header ', async function(assert) {
    

    await render(hbs`<Header />`);

   assert.dom('h1').exists();
   assert.dom('h1').hasText('Discover your favourite idea');
  });
});
