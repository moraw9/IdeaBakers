import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
// import firebase from 'firebase/app';


export default class LogInFormComponent extends Component {
  @tracked errorMessage;
  @service session;
  // @service firebaseApp;

  @action
  async authenticate(e) {
    e.preventDefault();
    let { identification, password } = this;
    // const auth = await this.get('firebaseApp').auth();
    try {
      // await this.session.authenticate('authenticator:firebase', identification, password);
      await this.session.authenticate('authenticator:oauth2', identification, password);
    } catch(error) {
      this.errorMessage = error.error || error;
    }

    if (this.session.isAuthenticated) {
      // What to do with all this success?
      alert("zalogowano!");
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