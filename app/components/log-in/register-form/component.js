import Component from '@glimmer/component';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { action } from '@ember/object';
import RegisterValidators from '../../../validations/register';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

export default class RegisterFormComponent extends Component {
  @service store;

  constructor() {
    super(...arguments);
    this.userModel = this.store.createRecord('user');
    this.changeset = new Changeset(
      this.userModel,
      lookupValidator(RegisterValidators),
      RegisterValidators
    );
  }

  @action
  async register(changeset) {
    const users = await this.store.findAll('user');
    later(
      this,
      () => {
        users.map((user) => console.log(user.email));
      },
      500
    );

    changeset.validate().then(() => {
      if (changeset.get('isValid')) {
        this.changeset.save();
        alert('Registration completed successfully!');
        changeset.rollback();
      }
    });
  }

  @action setValue({ target: { name, value } }) {
    this.changeset[name] = value;
  }

  @action
  rollback(changeset) {
    return changeset.rollback();
  }
  @action clear() {
    this.changeset.name = '';
  }
}
