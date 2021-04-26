import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class LogInComponent extends Component {
  @tracked isLogInForm = true;
  @tracked stateText = 'New to IdeaBakers?';
  @tracked buttonName = 'Sign up';

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
}
