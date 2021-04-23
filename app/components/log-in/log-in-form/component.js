import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LogInFormComponent extends Component {
  @tracked errorMessage;
  @tracked isAuthenticated = false;
  @service store;
  @service session;

  @action
  async authenticate(e) {
    e.preventDefault();
    const { identification, password } = this;

    try {
      await this.session.authenticate('authenticator:firebase', (auth) => {
        return auth.signInWithEmailAndPassword(identification, password);
      });
    } catch (error) {
      this.errorMessage = 'Incorrect email or password!';
    }
    if (this.session.isAuthenticated) {
      // What to do with all this success?
    }
  }

  @action
  updateIdentification(e) {
    this.identification = e.target.value;
  }

  @action
  updatePassword(e) {
    this.password = e.target.value;
  }
}
