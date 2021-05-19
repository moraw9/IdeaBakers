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
  @service notify;

  @tracked isLogInForm = true;
  @tracked stateText = 'New to IdeaBakers?';
  @tracked buttonName = 'Sign up';

  beforeModel() {
    return get(this, 'session')
      .fetch()
      .catch(() => {});
  }

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
    } else {
      this.stateText = 'New to IdeaBakers?';
      this.buttonName = 'Sign up';
    }
    this.isLogInForm = !this.isLogInForm;
  }

  async createGoogleRecord() {
    const currentGoogleUser = this.firebase.auth().currentUser;

    const [res] = this.users.filter(
      (user) => user.email == currentGoogleUser.email
    );
    if (res.email) return;

    const googleModel = this.store.createRecord('user');
    const spaceIndex = currentGoogleUser.displayName.indexOf(' ');

    googleModel.name = currentGoogleUser.displayName.slice(0, spaceIndex);
    googleModel.surname = currentGoogleUser.displayName.slice(
      spaceIndex + 1,
      currentGoogleUser.displayName.length
    );
    googleModel.email = currentGoogleUser.email;
    googleModel.photoURL = currentGoogleUser.photoURL;
    googleModel.save();
  }

  @action
  googleLogin() {
    // eslint-disable-next-line no-undef
    var provider = new firebase.auth.GoogleAuthProvider();
    try {
      this.session
        .authenticate('authenticator:firebase', (auth) => {
          return auth.signInWithPopup(provider);
        })
        .then(() => this.createGoogleRecord());
    } catch (error) {
      this.errorMessage = error.error || error;
    }
  }

  // setMessage() {
  //   this.notify.alert(
  //     'Congratulations! You have successfully joined us, log in!',
  //     {
  //       closeAfter: 5000,
  //     }
  //   );
  // }
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
      .then((result) => {
        this.toggleEmailExistenceError(false);
        changeset.save().then(() => changeset.transitionTo('loaded.saved'));
        // this.createChangeset();
        this.toggleForm();
        this.setMessage();
        return result.user.updateProfile({
          displayName: changeset.name,
        });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          this.toggleEmailExistenceError(true);
        }
      });
  }

  @action
  setDataToUpdate(data) {
    this.createChangeset();
    this.prepareChangesetToValidate(data);
    this.changeset.validate().then(() => {
      if (this.changeset.get('isValid')) {
        this.register(this.changeset);
      }
    });
  }
}
