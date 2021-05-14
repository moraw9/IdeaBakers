import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
export default class IndexComponent extends Component {
  @service store;
  @service session;
  @service firebase;
  constructor() {
    super(...arguments);
    this.model = this.store.findAll('idea');
    this.currentUser = this.firebase.auth().currentUser;
  }
  @tracked query = '';

  @action
  setSearchQuery(event) {
    this.query = event.target.value;
  }

  get results() {
    let { model, query } = this;
    if (query) {
      return model.filter((idea) => idea.title.includes(query));
    }
    return model;
  }
}
