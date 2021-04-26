import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
export default class IndexComponent extends Component {
  @service store;
  constructor() {
    super(...arguments);
    this.model = this.store.findAll('idea');
  }
  @tracked query = '';

  @action
  setSearchQuery(event) {
    this.query = event.target.value;
  }

  get results() {
    const { model, query } = this;

    if (query) {
      return model.filter((idea) => idea.title.includes(query));
    }
    return model;
  }
}
