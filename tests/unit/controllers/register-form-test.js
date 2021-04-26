import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | register-form', function (hooks) {
  setupTest(hooks);
  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:register-form');
    assert.ok(controller);
  });
});
