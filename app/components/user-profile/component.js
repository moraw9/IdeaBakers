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
    this.load();
    this.findUserDataTask.perform();
  }

  load() {
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
    res = yield this.user.currentUser;

    if (!res.pswd) this.isGoogleUser = true;
    return res;
  }
  @task({ restartable: true }) *putPhotoIntoStorageTask(photo) {
    console.log('weszło w task');
    const storageRef = this.firebase
      .storage()
      .ref('pictures' + this.userData.id);

    yield storageRef.put(photo);
    storageRef.getDownloadURL().then((url) => {
      this.userData.photoURL = url;
      console.log('ustawiło photoUrl');
    });
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
        console.log('is valid!');
        this.updateData(data);
      }
    });
  }

  prepareChangesetToValidate(data) {
    for (const property in data) {
      if (this.isGoogleUser && (property === 'pswd' || property === 'rpswd')) {
        this.changeset[property] = '12345678';
      }
      this.changeset[property] = data[property]
        ? data[property]
        : this.userData[property];
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

  async saveRecord() {
    this.userData
      .save()
      .then(() => {
        console.log('zapisało');
        document.getElementById('cancelForm').click();
        alert('Updated data successfuly');
        this.load();
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/user-token-expired':
          case 'auth/requires-recent-login':
            this.openModalForPassword();
            break;
        }
      });
  }

  async setPhotoURL(photo) {
    const storageRef = this.firebase
      .storage()
      .ref('pictures' + this.userData.id);

    storageRef.put(photo).then(() => {
      storageRef.getDownloadURL().then((url) => {
        this.userData.photoURL = url;
        this.saveRecord();
      });
    });
  }

  async updateData(data) {
    for (const property in data) {
      if (property !== 'photoURL' && data[property]) {
        this.userData[property] = data[property];
      }
    }
    if (data.photoURL) {
      this.setPhotoURL(data.photoURL);
    } else {
      this.saveRecord();
    }
  }
}
