import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
export default class IndexComponent extends Component {
  @service store;
  @service session;

  constructor() {
    super(...arguments);
    this.model = this.store.findRecord('idea', this.args.model.id);
  }
}
