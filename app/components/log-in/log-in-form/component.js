import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
// import firebase from 'firebase/app';


export default class LogInFormComponent extends Component {
  @tracked errorMessage;
  @tracked isAuthenticated = false;
  @service store;
  // @service firebaseApp;

  @action
  async authenticate(e) {
    e.preventDefault();
    let { identification, password } = this;
    const parent = document.getElementById('pswd').closest('.form-group');

    function checkIfErrorIs() {
      return parent.lastChild.textContent == 'Incorrect login or password!';
    }
    function removeError(){
      parent.removeChild( parent.lastChild );
    }
    function addError() {
      let html=`<p class="text-danger">Incorrect login or password!</p>`;
      parent.insertAdjacentHTML('beforeend', html);
    }

    const users = await this.store.findAll('user');

    let loginExist = users.filter(user => user.email === identification);
    let passwordExist = users.filter(user => user.pswd === password);

    if(loginExist.length && passwordExist.length){
      this.isAuthenticated = true;
      if(checkIfErrorIs()){
        removeError();
      }
    }else if(loginExist || passwordExist){
      if(!checkIfErrorIs()){
        addError();
      }
    }

    if (this.isAuthenticated) {
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
