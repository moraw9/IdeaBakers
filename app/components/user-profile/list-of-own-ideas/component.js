import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class ListOfOwnIdeasComponent extends Component {
  @service store;
  @service session;
  @service firebase;

  @tracked userIdeasList;

  constructor() {
    super(...arguments);
    this.findUserIdeasaTask.perform();
  }

  @task({ restartable: true }) *findUserIdeasaTask() {
    const ideas = yield this.store.findAll('idea');
    this.userIdeasList = ideas.filter(
      (idea) => idea.userUID == this.args.currentUser.uid
    );
  }
}
