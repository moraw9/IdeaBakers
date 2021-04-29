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
  @alias('currentUser.displayName') currentName;

  @tracked isNotGoogleUser = true;
  @tracked currentUser;
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
    let [res] = users.filter((user) => user.email == this.currentUser.email);
    if (!res) {
      this.isNotGoogleUser = false;
      res = {};
      let spaceIndex = this.currentName.indexOf(' ');
      res.name = this.currentName.slice(0, spaceIndex);
      res.surname = this.currentName.slice(
        spaceIndex + 1,
        this.currentName.length
      );
      res.email = this.currentUser.email;
    }
    return res;
  }

  @task({ restartable: true }) *findEmailTask(email) {
    const users = yield this.store.findAll('user');
    const [res] = users.filter((user) => user.email == email);
    return res;
  }

  @action
  toggleUpdate() {
    this.isUpdate = !this.isUpdate;
  }

  @action
  async setDataToUpdate(data) {
    this.prepareChangesetToValidate(data);
    // this.findUserRecordTask.perform();

    this.changeset.validate().then(() => {
      if (this.changeset.get('isValid')) {
        this.updateData(data);
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

  toggleEmailExistenceError(isError) {
    const parent = document.getElementById('email').closest('.form-group');

    function checkIfErrorIs() {
      return (
        parent.lastChild.textContent ===
        'The email address is already in use by another account.'
      );
    }
    if (isError && !checkIfErrorIs()) {
      let html = `<p class="text-danger">The email address is already in use by another account.</p>`;
      parent.insertAdjacentHTML('beforeend', html);
    } else if (!isError && checkIfErrorIs()) {
      parent.removeChild(parent.lastChild);
    }
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

  async updateData(data) {
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
          switch (error.code) {
            case 'auth/user-token-expired':
              debugger;
              this.reauthenticate();
              break;

            case 'auth/requires-recent-login':
              this.reauthenticate();
              break;
          }
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
          console.log('current po update email auth, przed update record', this.currentUser);
          debugger;
          this.store.findRecord('user', this.userData.id).then(function (user) {
            user.email = data.email;
            user.save();
          });
          console.log('Update email successful');
          this.toggleEmailExistenceError(false);
          this.findUserDataTask.perform();
          debugger;
        })
        .catch((error) => {
          console.log('mail error', error);

          switch (error.code) {
            case 'auth/user-token-expired':
              debugger;
              this.reauthenticate();
              break;

            case 'auth/email-already-in-use':
              this.toggleEmailExistenceError(true);
              break;

            case 'auth/requires-recent-login':
              this.reauthenticate();
              break;

            default:
              this.toggleEmailExistenceError(false);
              break;
          }
        });
    }
  }
}
