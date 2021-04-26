import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | idea bakers', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
    assert.dom('h1').hasText('Discover your favourite idea');
    assert.dom('.menu .logo-col').hasText('IdeaBakers');
    assert.dom('.menu .main-menu-col .items-wrapper .search-col').exists();
  });
});
