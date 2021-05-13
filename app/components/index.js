import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
export default class IndexComponent extends Component {
  @service store;
  @service session;
  constructor() {
    super(...arguments);
    this.model = this.store.findAll('idea');
    // eslint-disable-next-line no-undef
    this.currentUser = firebase.auth().currentUser;
  }
  @tracked query = '';

  @action
  setSearchQuery(event) {
    this.query = event.target.value;
  }

  get results() {
    let { model, query } = this;
    model = model.filter((idea) => typeof idea.title !== 'undefined');
    if (query) {
      return model.filter((idea) => idea.title.includes(query));
    }
    return model;
  }
}
