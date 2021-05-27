import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class IdeaComponent extends Component {
  @service store;
  @service session;
  @service firebase;

  @tracked otherUser;

  constructor() {
    super(...arguments);
    this.findUserTask.perform();
  }

  @task({ restartable: true }) *findUserTask() {
    this.otherUser = yield this.store.findRecord('user', this.args.idea.userId);
  }
}
