import Component from '@ember/component';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { action } from '@ember/object';
import RegisterValidators from '../../../validations/register';
import { inject as service } from '@ember/service';

export default class RegisterFormComponent extends Component {
  @service store;

  constructor() {
    super(...arguments);
    this.userModel = this.store.createRecord('user');
    this.changeset = new Changeset(this.userModel , lookupValidator(RegisterValidators),RegisterValidators) ;
    console.log("changeset", this.changeset);
  };
  @action
  async register(changeset) {

    const a = await this.store.findAll('user');
    console.log(a);
    const users = this.store.peekAll('user');
    console.log(users);
    debugger; 



    changeset.validate().then(() => {
      
      if(changeset.get('isValid')){
        this.changeset.save();
        alert('Registration completed successfully!');
        changeset.rollback();
      }     
    });
  };
  @action setValue({ target: { name, value } }){
    this.changeset[name] = value;
    

  }

  @action
  rollback(changeset) {
    return changeset.rollback();
  }
  @action clear(){
    this.set('changeset.name', '');
  }

}