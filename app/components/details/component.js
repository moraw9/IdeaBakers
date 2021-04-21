import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class IndexComponent extends Component {

  @service store ;

  constructor(){
    super(...arguments);
    // debugger;
    this.model = this.store.findRecord('idea', this.args.model.id);
  }
}