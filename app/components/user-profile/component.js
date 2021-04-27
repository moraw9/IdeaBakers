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
import { later } from '@ember/runloop';

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
  @task *findUserEmailTask(email) {
    console.log('email', email);
    const users = yield this.store.findAll('user');
    const [res] = users.filter((user) => user.email == email);
    console.log('res', res);
    return res.email;
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
  }
  @action
  async downloadData(data) {
    this.prepareChangesetToValidate(data);
    if (this.changeset.email != this.userData.email) {
      this.findUserEmailTask.perform(this.changeset.email);
      console.log(
        'this.findUserEmailTask.lastSuccessful',
        this.findUserEmailTask.lastSuccessful.value
      );
    }
    if (this.findUserEmailTask.lastSuccessful.value) {
      this.changeset.validate().then(() => {
        if (this.changeset.get('isValid')) {
          this.updateData();
        }
      });
    } else {
      alert('Email exists!');
    }
  }

  prepareChangesetToValidate(data) {
    this.changeset.name = data.name ? data.name : this.userData.name;
    this.changeset.surname = data.surname
      ? data.surname
      : this.userData.surname;
    this.changeset.email = data.email ? data.email : this.userData.email;
    this.changeset.pswd = data.pswd ? data.pswd : this.userData.pswd;
    this.changeset.rpswd = data.rpswd ? data.rpswd : this.userData.rpswd;
  }
  checkIfErrorIs(parent) {
    return parent.lastChild.textContent == 'This email is arleady exists!';
  }
  updateData() {
    console.log('Jesteś prawie u celu, brawo Ty! <3 ');
  }
}
