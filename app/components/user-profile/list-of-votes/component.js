import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class ListOfVotesComponent extends Component {
  @service store;
  @service session;
  @service firebase;

  @tracked userVotesList;

  constructor() {
    super(...arguments);
    this.findUserVotesTask.perform();
  }

  @task({ restartable: true }) *findUserVotesTask() {
    const ideas = yield this.store.findAll('kudo');
    this.userVotesList = ideas.filter(
      (vote) => vote.userId == this.args.userData.id
    );
  }
}
