import Component from '@glimmer/component';
import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { action } from '@ember/object';
import RegisterValidators from '../../../validations/register';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
export default class RegisterFormComponent extends Component {
  @service store;

  constructor() {
    super(...arguments);
    this.userModel = this.store.createRecord('user');
    this.changeset = new Changeset(
      this.userModel,
      lookupValidator(RegisterValidators),
      RegisterValidators
    );
  }

  @action
  async register(changeset) {
    const parent = document.getElementById('email').closest('.form-group');
    function checkIfwarringIs() {
      return parent.lastChild.textContent == 'This email is arleady exists!';
    }
    const users = await this.store.findAll('user');
    later(
      this,
      () => {
        const emails = users.map((user) => user.email);
        const [email] = emails.filter((email) => email === changeset.email);
        if (email) {
          if (!checkIfwarringIs()) {
            let html = `<p class="text-danger">This email is already exists!</p>`;
            parent.insertAdjacentHTML('beforeend', html);
          }
          return;
        } else if (checkIfwarringIs()) {
          parent.removeChild(parent.lastChild);
        }
      },
      500
    );

    changeset.validate().then(() => {
      if (changeset.get('isValid')) {
        this.changeset.save();
        alert('Registration completed successfully!');
        changeset.rollback();
      }
    });
  }

  @action setValue({ target: { name, value } }) {
    this.changeset[name] = value;
  }

  @action
  rollback(changeset) {
    return changeset.rollback();
  }
  @action clear() {
    this.changeset.name = '';
  }
}
