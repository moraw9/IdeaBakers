import Component from '@glimmer/component';
import { action } from '@ember/object';
import { typeOf } from '@ember/utils';
import { inject as service } from '@ember/service';

export default class UserFormComponent extends Component {
  @service firebase;

  constructor() {
    super(...arguments);
    this.data = {
      name: null,
      surname: null,
      email: null,
      pswd: null,
      rpswd: null,
    };
  }

  @action
  cancel() {
    if (typeOf(this.args.deleteModel) === 'function') {
      this.args.deleteModel();
    }

    let inputs = document.querySelectorAll('input');
    inputs.forEach((input) => (input.value = ''));

    if (typeOf(this.args.toggleState) === 'function') {
      this.args.toggleState();
    }
  }

  @action
  setValue({ target: { name, value } }) {
    this.data[name] = value;
  }

  @action
  sendData() {
    this.args.setDataToUpdate(this.data);
  }

  @action
  encodeImageFileAsURL({ target: { files } }) {
    this.data.photoURL = files[0];
  }
}
