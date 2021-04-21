import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
// import firebase from 'firebase/app';

export default class LogInComponent extends Component {
  @service store;
  // @service firebaseApp;

  @tracked isLogInForm = true;
  @tracked stateText = "New to IdeaBakers?";
  @tracked buttonName = "Sign up";

  @action
  toggleForm() {
    if (this.isLogInForm) {
      this.buttonName = "Log in";
      this.stateText = "Have an account?";
    }
    else{
      this.stateText = "New to IdeaBakers?";
      this.buttonName = "Sign up";
    }
    this.isLogInForm = !this.isLogInForm;
  };
  @action
  async googleLogin() {
  //   const auth = await this.get('firebaseApp').auth();
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   return auth.signInWithPopup(provider);
  }
}
