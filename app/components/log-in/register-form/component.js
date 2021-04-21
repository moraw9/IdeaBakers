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

  };


  @action
  register(changeset) {     
    changeset.validate().then(() => {
      if(changeset.get('isValid')){
        this.changeset.save();
        alert('Registration completed successfully!');
      }     
    });
  };

  @action setValue( { target: { name, value } }){
     this.changeset[name] = value;
     const {model} = this;
     console.log(model);
     console.log(this.model);

    if(name === 'email'){
      // let user = model.filter( record => record.email === value);
      // console.log( model.filter( record => record.email === value));
      // console.log("user", user);
      // if(user && user.email == value){
      //   let html =`
      //   <p class="text-danger">This email is already exist.</p>
      //   `;
      //   document.getElementById('email').insertAdjacentHTML('beforeend', html);
      // }else{
      // this.changeset[name] = value;
      // }

    };
  };

  @action
  rollback(changeset) {
    return changeset.rollback();
  }
  @action clear(){
    this.set('changeset.name', '');
  }

}