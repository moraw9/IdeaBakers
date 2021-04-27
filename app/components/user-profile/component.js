import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import lookupValidator from 'ember-changeset-validations';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Changeset } from 'ember-changeset';
import RegisterValidators from '../../validations/register';
import { task } from 'ember-concurrency';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { alias } from '@ember/object/computed';

export default class UserProfileComponent extends Component {
  @service store;
  @service session;
  @service currentUser;
  @alias('findUserDataTask.lastSuccessful.value') userData;

  @tracked isUpdate = true;
  constructor() {
    super(...arguments);
    this.load();
    this.findUserDataTask.perform();
    this.userModel = this.store.createRecord('user');
    this.changeset = new Changeset(
      this.userModel,
      lookupValidator(RegisterValidators),
      RegisterValidators
    );
  }
  async load() {
    // eslint-disable-next-line no-undef
    this.currentUser = firebase.auth().currentUser;
  }
  @task *findUserDataTask() {
    const users = yield this.store.findAll('user');
    const [res] = users.filter((user) => user.email == this.currentUser.email);
    return res;
  }
  @action
  setValue({ target: { name, value } }) {
    this.changeset[name] = value;
  }

  @action
  rollback(changeset) {
    return changeset.rollback();
  }
  @action
  toggleUpdate() {
    this.isUpdate = !this.isUpdate;
    console.log(this.isUpdate);
  }
}
