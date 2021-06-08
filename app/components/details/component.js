import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
export default class IndexComponent extends Component {
  @service store;
  @service session;

  @tracked otherUser;
  @tracked model;
  @tracked users;

  constructor() {
    super(...arguments);
    this.loadModelTask.perform();
  }

  @task({ restartable: true }) *loadModelTask() {
    this.model = yield this.store.findRecord('idea', this.args.model.id);
    this.users = yield this.store.findAll('user');

    this.otherUser = yield this.store.findRecord('user', this.model.userId);
  }
}
