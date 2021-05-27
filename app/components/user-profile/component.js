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
  @service firebase;
  @service('current-user') user;

  @alias('findUserDataTask.lastSuccessful.value') userData;

  @tracked currentUser;
  @tracked isUpdate = true;
  @tracked isGoogleUser = false;
  @tracked changeset;

  constructor() {
    super(...arguments);
    this.model = this.store.findRecord('user', this.args.model.id);

    this.load();
    this.findUserDataTask.perform();
  }

  load() {
    if (!this.session.isAuthenticated) {
      return;
    }

    this.currentUser = this.user.currentUser;
  }
  createChangeset() {
    this.userModel = this.store.createRecord('user');
    this.changeset = new Changeset(
      this.userModel,
      lookupValidator(RegisterValidators),
      RegisterValidators
    );
  }

  @task({ restartable: true }) *findUserDataTask() {
    let res;
    if (this.args.model) {
      res = this.args.model;
      return res;
    }

    const users = yield this.store.findAll('user');
    [res] = users.filter((user) => user.email === this.currentUser.email);

    if (!res.pswd) this.isGoogleUser = true;
    return res;
  }

  @action
  toggleUpdate() {
    if (this.isUpdate) {
      this.createChangeset();
    }
    this.isUpdate = !this.isUpdate;
  }
  @action
  deleteModel() {
    this.userModel.destroyRecord();
  }

  @action
  setDataToUpdate(data) {
    this.prepareChangesetToValidate(data);

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

    if (this.isGoogleUser) {
      this.changeset.pswd = this.changeset.rpswd = '12345678';
    } else {
      this.changeset.pswd = data.pswd ? data.pswd : this.userData.pswd;
      this.changeset.rpswd = data.rpswd ? data.rpswd : this.userData.rpswd;
    }
  }

  toggleErrorExistence(isError, parent, message) {
    function checkIfErrorIs() {
      return parent.lastChild.textContent === message;
    }
    if (isError && !checkIfErrorIs()) {
      let html = `<p class="text-danger">${message}</p>`;
      parent.insertAdjacentHTML('beforeend', html);
    } else if (!isError && checkIfErrorIs()) {
      parent.removeChild(parent.lastChild);
    }
  }

  @action
  reauthenticate() {
    const input = document.getElementById('reauthenticatedPasswordInput');
    const password = input.value;
    let credential = this.firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      password
    );
    this.firebase
      .auth()
      .currentUser.reauthenticateWithCredential(credential)
      .then(() => {
        input.value = '';
        document.getElementById('closeModalButton').click();
        alert('Re authenticate finished successed, enert data one more time');
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  }

  openModalForPassword() {
    document.getElementById('openModalButton').click();
  }

  async updateData(data) {
    let isOk = true;

    if (data.pswd) {
      this.currentUser
        .updatePassword(data.pswd)
        .then(() => {
          this.store.findRecord('user', this.userData.id).then(function (user) {
            user.pswd = user.rpswd = data.pswd;
            user.save();
          });
        })
        .catch((error) => {
          isOk = false;
          switch (error.code) {
            case 'auth/user-token-expired':
            case 'auth/requires-recent-login':
              this.openModalForPassword();
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
        });
    }

    if (data.surname) {
      this.store.findRecord('user', this.userData.id).then(function (user) {
        user.surname = data.surname;
        user.save();
      });
    }

    if (data.photoURL?.size) {
      const storageRef = this.firebase
        .storage()
        .ref('pictures' + this.currentUser.id);

      storageRef.put(data.photoURL).then(() => {
        storageRef.getDownloadURL().then((url) => {
          this.currentUser.updateProfile({
            photoURL: url,
          });

          this.store.findRecord('user', this.userData.id).then(function (user) {
            user.photoURL = url;
            user.save();
          });
        });
      });
    }

    if (isOk) {
      document.getElementById('cancelForm').click();
      alert('Updated data successfuly');
      this.load();
    }
  }
}
