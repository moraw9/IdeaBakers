import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import RegisterValidators from '../../validations/register';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
export default class LogInComponent extends Component {
  @service store;
  @service session;
  @service firebase;
  @service('current-user') user;

  @tracked isLogInForm = true;
  @tracked stateText = 'New to IdeaBakers?';
  @tracked buttonName = 'Sign up';
  @tracked changeset;

  constructor() {
    super(...arguments);
    this.users = this.store.findAll('user');
  }

  createChangeset() {
    this.userModel = this.store.createRecord('user');
    this.changeset = new Changeset(
      this.userModel,
      lookupValidator(RegisterValidators),
      RegisterValidators
    );
  }

  @action
  toggleForm() {
    if (this.isLogInForm) {
      this.buttonName = 'Log in';
      this.stateText = 'Have an account?';
      this.createChangeset();
    } else {
      this.stateText = 'New to IdeaBakers?';
      this.buttonName = 'Sign up';

      if (typeof this.userModel.name === 'undefined') {
        this.userModel.destroyRecord();
      }
    }
    this.isLogInForm = !this.isLogInForm;
  }

  async createGoogleRecord() {
    if (!this.session.isAuthenticated) {
      return;
    }
    const currentGoogleUser = this.session.data.authenticated.user;
    const [res] = this.users.filter(
      (user) => user.email === currentGoogleUser.email
    );

    if (typeof res !== 'undefined') return;

    const spaceIndex = currentGoogleUser.displayName.indexOf(' ');
    const googleModel = this.store.createRecord('user', {
      id: currentGoogleUser.uid,
      name: currentGoogleUser.displayName.slice(0, spaceIndex),
      surname: currentGoogleUser.displayName.slice(
        spaceIndex + 1,
        currentGoogleUser.displayName.length
      ),
      email: currentGoogleUser.email,
      photoURL: currentGoogleUser.photoURL,
    });
    await googleModel.save();
  }

  @action
  googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    try {
      this.session
        .authenticate('authenticator:firebase', (auth) => {
          return auth.signInWithPopup(provider);
        })
        .then((result) => this.createGoogleRecord(result));
    } catch (error) {
      this.errorMessage = error.error || error;
    }
  }

  setMessage() {
    const html =
      '<div class="alert" data-test-alert >Congratulations! You have successfully joined us, log in!</div>';
    const element = document.querySelector('.log-in-box');
    element.insertAdjacentHTML('beforeend', html);

    setTimeout(() => {
      element.removeChild(element.lastChild);
    }, 5000);
  }

  prepareChangesetToValidate(data) {
    this.changeset.name = data.name;
    this.changeset.surname = data.surname;
    this.changeset.email = data.email;
    this.changeset.pswd = data.pswd;
    this.changeset.rpswd = data.rpswd;
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

  async register(changeset) {
    this.firebase
      .auth()
      .createUserWithEmailAndPassword(changeset.email, changeset.pswd)
      .then(async (result) => {
        this.toggleEmailExistenceError(false);
        const id = await result.user.uid;
        const { name, surname, email, pswd, rpswd } = changeset;
        const newUser = await this.store.createRecord('user', {
          id,
          name,
          surname,
          email,
          pswd,
          rpswd,
        });
        await newUser.save();
        this.toggleForm();
        this.setMessage();
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          this.toggleEmailExistenceError(true);
        }
      });
  }

  @action
  setDataToUpdate(data) {
    this.prepareChangesetToValidate(data);
    this.changeset.validate().then(() => {
      if (this.changeset.get('isValid')) {
        this.register(this.changeset);
      }
    });
  }
}
