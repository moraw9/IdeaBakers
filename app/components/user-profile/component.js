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
  @alias('findUserDataTask.lastSuccessful.value') userData;
  @tracked currentUser;
  @tracked dbUserRer;

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
  @task({ restartable: true }) *findUserDataTask() {
    const users = yield this.store.findAll('user');
    const [res] = users.filter((user) => user.email == this.currentUser.email);
    return res;
  }
  @task *findUserRecordTask() {
    const [record] = yield this.store.findRecord('user', this.userData.id);
    return record;
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
    // this.findUserRecordTask.perform();
    this.changeset.validate().then(() => {
      if (this.changeset.get('isValid')) {
        this.updateData(data);
        this.toggleUpdate();
      }
    });
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
  reauthenticate() {
    let password = prompt('Please provide your password for reauthentication');
    // eslint-disable-next-line no-undef
    let credential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      password
    );
    // eslint-disable-next-line no-undef
    firebase
      .auth()
      .currentUser.reauthenticateWithCredential(credential)
      .then(() => {
        alert('Re authenticate finished successed, enert data one more time');
      })
      .catch((error) => {
        // An error occurred.
        console.log('reauthenticate error', error);
      });
  }
  updateData(data) {
    if (data.pswd) {
      this.currentUser
        .updatePassword(data.pswd)
        .then(() => {
          this.store.findRecord('user', this.userData.id).then(function (user) {
            user.pswd = user.rpswd = data.pswd;
            user.save();
            console.log('Update pswd successful');
            debugger;
          });
        })
        .catch(function (error) {
          console.log('pswd error', error);
          debugger;
        });
    }
    if (data.name) {
      this.currentUser
        .updateProfile({
          displayName: data.name,
        })
        .then(() => {
          this.store.findRecord('user', this.userData.id).then(function (user) {
            user.name = data.name;
            user.save();
          });
          console.log('Update name successful');
        })
        .catch(function (error) {
          console.log('name error', error);
        });
    }
    if (data.surname) {
      this.store.findRecord('user', this.userData.id).then(function (user) {
        user.surname = data.surname;
        user.save();
      });
    }
    if (data.email) {
      this.currentUser
        .updateEmail(data.email)
        .then(() => {
          this.store.findRecord('user', this.userData.id).then(function (user) {
            user.email = data.email;
            user.save();
          });
          console.log('Update email successful');
          debugger;
        })
        .catch((error) => {
          console.log('mail error', error);
          if (error.code === 'auth/user-token-expired') this.reauthenticate();
          debugger;
        });
    }
  }
}
