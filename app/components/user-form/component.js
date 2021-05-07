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
    let inputs = document.querySelectorAll('input');
    inputs.forEach((input) => (input.value = ''));
    if (typeOf(this.args.toggleState) === 'function') {
      this.args.toggleState();
    }
  }
  @action
  setValue({ target: { name, value } }) {
    this.data[name] = value;
    console.log(this.data[name]);
  }
  @action
  sendData() {
    this.args.setDataToUpdate(this.data);
  }
  @action
  encodeImageFileAsURL({ target: { files } }) {
    this.data.avatar = files[0];
  }
}
