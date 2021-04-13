import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | idea', function (hooks) {
  setupRenderingTest(hooks);


  test('it renders information about a idea property', async function (assert) {
    await render(hbs`<Idea />`);

  
    assert.dom('.card').exists();
    assert.dom('.card .idea-author i').hasText('Veruca Salt');
  });
    
});