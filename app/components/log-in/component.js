import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class LogInComponent extends Component {
  @service store;
  @service session;

  @tracked isLogInForm = true;
  @tracked stateText = 'New to IdeaBakers?';
  @tracked buttonName = 'Sign up';

  beforeModel() {
    return get(this, 'session')
      .fetch()
      .catch(() => {});
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
  @action
  googleLogin() {
    // eslint-disable-next-line no-undef
    var provider = new firebase.auth.GoogleAuthProvider();
    try {
      this.session.authenticate('authenticator:firebase', (auth) => {
        return auth.signInWithPopup(provider);
      });
    } catch (error) {
      this.errorMessage = error.error || error;
    }
  }
}
