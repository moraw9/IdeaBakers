import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import lookupValidator from 'ember-changeset-validations';
import { action } from '@ember/object';
import { Changeset } from 'ember-changeset';
import RegisterValidators from '../../validations/register';
import { later } from '@ember/runloop';
export default class UserProfileComponent extends Component {
  @service store;
  @service session;
  @service currentUser;

  constructor() {
    super(...arguments);
    this.load();
    this.isUpdate = true;
    this.userModel = this.store.createRecord('user');
    this.changeset = new Changeset(
      this.userModel,
      lookupValidator(RegisterValidators),
      RegisterValidators
    );
  }
  async load() {
    // eslint-disable-next-line no-undef
    this.user = firebase.auth().currentUser;
    const users = await this.store.findAll('user');
    users.forEach((user) => {
      if (user.email === this.user.email) {
        this.userData = user;
        console.log(this.userData.name);
      }
    });
  }

  @action
  setValue({ target: { name, value } }) {
    this.changeset[name] = value;
  }

  @action
  rollback(changeset) {
    return changeset.rollback();
  }
}
