import Component from '@ember/component';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { action } from '@ember/object';
import RegisterValidators from '../../../validations/register';
import { inject as service } from '@ember/service';
import { doc } from 'prettier';

export default class RegisterFormComponent extends Component {
  @service store;

  constructor() {
    super(...arguments);
    // this.emailUser = this.store.createRecord('user');
    this.userModel = this.store.createRecord('user');
    this.changeset = new Changeset(this.userModel , lookupValidator(RegisterValidators),RegisterValidators) ;
  };
  @action
  register(changeset) {
    // this.store.query('user', {
    //   filter: {
    //     email: this.changeset.email
    //   }
    // }).then(function(data) {
    //   console.log(data);
    //   this.changeset.error.email = true;
    //   this.changeset.error.email.validation = `This email alreay exist.`;
    // });
    // if( this.store.findAll('user').filter((user) => user.email === this.changeset.email)){
    //   // this.changeset.error.email = true;
    //   // this.changeset.error.email.message += `This email alreay exist.`;
    //   alert(`This email alreay exist.`);
    //   return;
    // }
      
    changeset.validate().then(() => {
      if(changeset.get('isValid')){
        this.changeset.save();
        alert('Registration completed successfully!');
      }     
    });
  };
  @action setValue( { target: { name, value } }){
    // this.changeset[name] = value;

    if(name === 'email'){
      const findEmail = async function(store){
        return store.findAll('user').filter( user => (user.email === value));
      }
      findEmail(this.store).then(response => console.log(response));
      // this.emailUser = findEmail(this.store);
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