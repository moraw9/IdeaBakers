import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class UserFormComponent extends Component {
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
    this.args.toggleUpdate();
  }
  @action
  setValue({ target: { name, value } }) {
    this.data[name] = value;
    console.log(this.data[name]);
  }
  @action
  sendData() {
    console.log('weszło');
    this.args.downloadData(this.data);
  }
}
