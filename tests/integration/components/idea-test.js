import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | idea', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders information about a idea property', async function (assert) {
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
    let idea = await store.findRecord('idea', serverModel.id);
    this.set('idea', idea);

    await render(hbs`<Idea @idea={{idea}} />`);

    assert.dom('.card').exists();
    assert.dom('[data-test-title]').hasText('Ember Simple Title');
    assert
      .dom('[data-test-description]')
      .hasText('Lorem ipsum dolor sit amet, consectetur adipiscing elit...');
    assert.dom('[data-test-author]').hasText('Asia');
    assert.dom('[data-test-img]').hasAttribute('style');

    let style = document.querySelector('[data-test-img]').getAttribute('style');
    assert.equal(
      style,
      `background-image: url(https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg);`
    );
  });
});
